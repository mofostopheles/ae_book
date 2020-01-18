# -*- coding: utf8 -*-
'''
	USAGE
	• Place this script and the lib folder at the sibling level of the PNG folders
		you want to convert e.g. in your render/output folder.
	• Nothing to set, you just run the script. If there are directories containing
		PNGs, a sprite will be constructed for each unique set.
	• Directories with names like "misc" or "processed" or "boneyard", etc, will
		be ignored. All other directories are globbed for *.png files.

	LICENSE
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Lesser General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
'''
import os
import sys
import glob
import subprocess
import argparse
import textwrap
from PIL import Image
import lib.png_sprite_maker as _sprite_maker
import lib.text_colors as _text_colors

__author__ = "Arlo Emerson <arloemerson@gmail.com>"
__version__ = "1.7"
__date__ = "1/14/2020"

class MakeSpritesFromSequences():
	"""
	This script makes a 1 row horizontal sprite from PNGs that are already
	organized into directories. Typically these would have been exported from
	After Effects using a PNG Sequence render output module.
	"""
	def __init__(self):
		print("Running " + _text_colors.HEADERLEFT2 + _text_colors.INVERTED + self.__class__.__name__ + " " + _text_colors.ENDC)

		_text_colors.print_logo()

		self.working_dir = ""
		self.working_dir_short_name = ""
		self.output_type = "png"
		self.verbose = False
		self.vertical = None #default to horizontal sprites
		self.quality = 70
		self.qset = None
		self.qset_list = [50, 60, 70, 75, 80, 85, 90, 95]
		self.encoder = "pillow"
		self.extent = 600
		self.crop = False
		self.sprite_prefix = "sprite-"

		self.setup_parser()

	def setup_parser(self):
		'''Capture args from the command line'''
		parser = argparse.ArgumentParser( \
			description='This script makes a 1 row horizontal sprite from ' + \
			_text_colors.WARNING + 'PNGs that are already organized into directories. ' + \
			_text_colors.ENDC + '\nTypically these would have been exported from After' + \
			'Effects\nusing the built-in PNG Sequence render output module.', \
			epilog=textwrap.dedent('''Setup: ''' + \
	'''
	• Place this script and the lib folder at the sibling level of the\n''' + \
	'''\t  PNG folders you want to convert e.g. in your render/output folder.
	• Nothing to set, you just run the script. If there are directories\n''' + \
	'''\t  containing PNGs, a sprite will be constructed for each unique set.
	• Directories with names like "misc" or "processed" or "boneyard",\n''' + \
	'''\t  etc, will be ignored. All other directories are globbed for *.png files.''' \
	), formatter_class=argparse.RawTextHelpFormatter)
		parser.add_argument('-vert', '--vertical', dest='vertical', action='store_true', help="For making vertical sprites.\nDefault is horizontal.")
		parser.add_argument('-e', '--encoder', dest='encoder', required=False, help="The specific lib to use to encode the output.\n" + \
			"Default encoder is Pillow.\nUse -e imagemagic|magic to use the size constraint feature which looks something like:\n" + \
			_text_colors.OKGREEN + "python3 make_sprites_from_sequences.py -t jpg -e magic -x 700" + _text_colors.ENDC)
		parser.add_argument('-t', '--type', dest='type', required=False, help="For JPEG output use -type jpg|JPG|jpeg|JPEG.\nDefault output is PNG.")
		parser.add_argument('-x', '--extent', dest='extent', required=False, help="Sets the extent flag in the ImageMagick conversion.")
		parser.add_argument('-q', '--quality', dest='quality', required=False, help="e.g. For JPEG with quality 80 use -q 80.\nDefault quality is 70.")
		parser.add_argument('-qset', dest='qset', action='store_true', help="e.g. To export a range of quality settings 50 through 100.\nDefault quality is 70.")
		parser.add_argument('-v', '--verbose', dest='verbose', action='store_true', help="Explain what is being done.")
		parser.add_argument('-crop', '--crop', dest='crop', action='store_true', help="Auto crop the sprites per spec.")
		parser.add_argument('--version', action='version', version='%(prog)s ' + __version__)
		args = parser.parse_args()

		print("\n----- PREFLIGHT SUMMARY -----")

		if args.type:
			self.output_type = args.type
			print("Output type is " + args.type + ".")
		else:
			if args.encoder:
				if "magic" in args.encoder:
					print(_text_colors.WARNING + "No file type was specified, but assuming JPG since you invoked ImageMagick." + _text_colors.ENDC)
					self.output_type = "jpg"
				else:
					print("Will create PNG sprites.")
			else:
				print("Will create PNG sprites.")

		if args.verbose:
			self.verbose = args.verbose
			if self.verbose:
				print("Verbose mode")

		if args.crop:
			self.crop = True

		if args.encoder:
			self.encoder = args.encoder.lower()
			print("Encoder type: " + args.encoder)
		else:
			print("Will save files using Pillow. Use -e magic to use the ImageMagick library.")

		if args.extent:
			self.extent = args.extent.lower()

			if not args.encoder: # extent was set but the encoder was not, so assume ImageMagick is desired.
				self.encoder = "magic"

			print("extent: " + args.extent)
		else:
			print("Will save at 600KB if magic was called. Use -x flag and pass in a number for KB.")

		if args.vertical:
			self.vertical = args.vertical
			print("Making vertical sprites.")
		else:
			print("Will create horizontal sprites.")

		if args.quality:
			self.quality = args.quality
			print("JPG quality set to " + str(args.quality))

			if args.encoder is not None and "magic" in args.encoder:
				print(_text_colors.WARNING + "You set the quality flag to " + self.quality + " but encoder is ImageMagick with the default extent flag built in. If you want to set quality use the default encoder by omitting -e magic or using -e pillow." + _text_colors.ENDC)
		else:
			if self.output_type != "png":
				print("Will use JPG 70 quality.")

		if args.qset:
			self.qset = args.qset
			print("qset is " + str(args.qset))
		else:
			if self.output_type != "png":
				print("qset ommited, will use JPG 70 quality.")

		print(_text_colors.DASH_LINE)

	def main(self):
		'''Main method of class.'''
		
		print(_text_colors.DASH_LINE)
		files = sorted(glob.glob(str(self.working_dir)  + '*.png'))

		if len(files) == 0:
			print(_text_colors.WARNING + "Found nothing to convert in " + _text_colors.ENDC + _text_colors.CYAN + self.working_dir + _text_colors.ENDC)
			return

		number_of_frames = len(files) # this equates to number of frames in the sprite
		self.local_print(_text_colors.WHITE + "Number of frames: " + _text_colors.ENDC + _text_colors.CYAN + str(number_of_frames) + _text_colors.ENDC)
		tmp_image = Image.open(files[0])

		if self.vertical:
			processed_sprite = _sprite_maker.make_vertical_sprite(files, number_of_frames, tmp_image.size[0], tmp_image.size[1])
		else:
			processed_sprite = _sprite_maker.make_sprite(files, number_of_frames, tmp_image.size[0], tmp_image.size[1])

		file_name = self.sprite_prefix + self.working_dir_short_name + ".png"

		if self.output_type == "png":
			if processed_sprite:
				processed_sprite.save(file_name)
				self.print_sprite_complete(file_name)
			else:
				print(_text_colors.FAIL + "Failed to make sprite " +  _text_colors.ENDC + _text_colors.WHITE + file_name + _text_colors.ENDC)
		else:
			if self.qset:
				qset = self.qset_list # 100 disables portions of the JPEG compression algorithm, and results in large files with hardly any gain in image quality.
				self.local_print(_text_colors.WHITE + "Using this qset: " + _text_colors.ENDC + _text_colors.CYAN + str(self.qset_list) + _text_colors.ENDC)
			else:
				qset = [self.quality]
				self.local_print(_text_colors.WHITE + "Using JPG quality of "  + _text_colors.ENDC + _text_colors.CYAN + str(self.quality) + _text_colors.ENDC)

			for quality_value in qset:

				if self.crop: # crop the sprite according to the crop specs
					processed_sprite = self.crop_image(processed_sprite)

				# if there is an alpha channel this will remove it
				dealpha_image = processed_sprite.convert("RGB")

				if self.encoder == "pillow":
					# file_name = self.sprite_prefix + self.working_dir_short_name + "-quality_value" + str(quality_value) + ".jpg"
					file_name = self.sprite_prefix + self.working_dir_short_name + ".jpg"
					full_file_path = file_name
					self.local_print(_text_colors.WHITE + "Quality set to " + str(quality_value) + _text_colors.ENDC)
					dealpha_image.save(full_file_path, format='JPEG', subsampling=0, quality=int(quality_value), optimize=True, progressive=True)
					self.print_sprite_complete(full_file_path)

				elif self.encoder == "magic" or self.encoder == "imagemagic":
					try:
						file_name = self.sprite_prefix + self.working_dir_short_name + ".jpg"
						full_file_path = file_name

						processed_sprite.save(full_file_path + ".png") # this is really a temp file
						self.local_print(_text_colors.WHITE + "Converting with " + _text_colors.ENDC + _text_colors.CYAN + str(self.extent) + _text_colors.ENDC + _text_colors.WHITE + " KB extent" + _text_colors.ENDC)
						arg = "convert " + full_file_path + ".png -define jpeg:extent=" + str(self.extent) + "kb " + full_file_path
						self.local_print(_text_colors.DARKGREEN + arg + _text_colors.ENDC)
						os.system(arg)
						os.system("rm " + full_file_path + ".png") # remove the temp file
						self.local_print(_text_colors.WHITE + "Removed a temp PNG file." + _text_colors.ENDC)
						self.print_sprite_complete(full_file_path)
					except Exception as exception:
						print("If you're seeing this error, make sure you are passing in -e magic on the command line. Does not work from within SUBLIME.")
						raise exception

	def crop_image(self, image_to_crop):
		'''Crop an image based on name/size.'''
		print("recropping ", image_to_crop)

		# these must be even numbers
		cropping_height_320x480 = 422
		cropping_height_300x250 = 214
		cropping_height_160x600 = 588
		cropping_height_300x600 = 532
		cropping_height_480x320 = 292
		cropping_height_640x480 = 404
		cropping_height_120x600 = 590
		cropping_height_336x280 = 240
		cropped_image = None
		recrop_image = image_to_crop
		if self.working_dir_short_name.find("-layer1") > -1: # TOP IMAGE
			if self.working_dir_short_name.find("320x480") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_320x480))	# left top right bottom 423
			elif self.working_dir_short_name.find("300x250") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_300x250))
			elif self.working_dir_short_name.find("160x600") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_160x600))
			elif self.working_dir_short_name.find("300x600") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_300x600))
			elif self.working_dir_short_name.find("480x320") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_480x320))
			elif self.working_dir_short_name.find("640x480") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_640x480))
			elif self.working_dir_short_name.find("120x600") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_120x600))
			elif self.working_dir_short_name.find("336x280") > -1:
				cropped_image = recrop_image.crop((0, 0, recrop_image.width, cropping_height_336x280))
		elif self.working_dir_short_name.find("-layer0") > -1: # BOTTOM IMAGE
			if self.working_dir_short_name.find("320x480") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_320x480, recrop_image.width, recrop_image.height))
			elif self.working_dir_short_name.find("300x250") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_300x250, recrop_image.width, recrop_image.height))
			elif self.working_dir_short_name.find("160x600") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_160x600, recrop_image.width, recrop_image.height))
			elif self.working_dir_short_name.find("300x600") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_300x600, recrop_image.width, recrop_image.height))
			elif self.working_dir_short_name.find("480x320") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_480x320, recrop_image.width, recrop_image.height))
			elif self.working_dir_short_name.find("640x480") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_640x480, recrop_image.width, recrop_image.height))
			elif self.working_dir_short_name.find("120x600") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_120x600, recrop_image.width, recrop_image.height))
			elif self.working_dir_short_name.find("336x280") > -1:
				cropped_image = recrop_image.crop((0, cropping_height_336x280, recrop_image.width, recrop_image.height))

		return cropped_image

	def print_sprite_complete(self, sprite_name):
		'''End of process, tell user we are done.'''
		print("\nThe sprite " + _text_colors.KNOCKOUT + sprite_name + _text_colors.ENDC + " has been created.")

	def open_folder(self, p_dir):
		'''Open the directory where the sprites are.'''
		if sys.platform == 'darwin':
			subprocess.Popen(['open', '--', p_dir])
		elif sys.platform == 'linux2':
			subprocess.Popen(['xdg-open', p_dir])
		elif sys.platform == 'win32':
			subprocess.Popen(['explorer', p_dir.replace("/", "\\")])


	def local_print(self, string_message):
		'''Print to console if verbose.'''
		if self.verbose:
			print(string_message)

# get our directories
# assumes this script is running at sibling level to these folders
DIRS = next(os.walk('.'))[1]

# instantiate the class
WORKER = MakeSpritesFromSequences()

for dir_name in DIRS:
	# important and basic check so we don't try to process the "processed" folder
	# if you have other folder titles you'd like to avoid processing, add them here
	if dir_name not in ('processed', 'misc', 'lib', 'boneyard', 'archive'):
		WORKER.working_dir_short_name = dir_name
		WORKER.working_dir = dir_name + "/"
		try:
			WORKER.main() # call main on WORKER
		except Exception as exception:
			print(_text_colors.ERROR_EMOJI)
			raise exception
