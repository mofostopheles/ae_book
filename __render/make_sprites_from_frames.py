# -*- coding: utf8 -*-
'''
	This script makes a 1 row horizontal sprite from loose,
	unorganized PNGs that have been exported from After Effects
	using the "__generate_sequences_from_frames.jsx" script. 
	
	In After Effects the comp would be named e.g. "home-mini-ao-loopable-coral-[frame]-300x600"
	where "[frame]" is dynamically replaced by numbered guide layers. 
	
	USAGE:
	• Place this script and the lib folder in your render/output folder.
	• Nothing to set, you just run the script. If there are PNGs present, 
	  a sprite will be constructed for each unique set of PNGs (based on the filenames).
	• A temp folder "__sprite_staging_area" will be created at this script's location to hold sorted PNGs. 
	  Organizing the PNGs into folders is something normally done by After Effects, 
	  however our script obliterates the inherant foldering mechanism, 
	  and the ability to make a directory is not exposed in a JSX script. 
	• The temp folder "__sprite_staging_area" will be removed at the end of this script's execution.
	• Use args -vert to create vertical sprites.
	• Use -t jpg to set output type to JPG.
	• Use -q to set JPG quality, default is 70
	• Use -qset to export a range of qualities	
	• To see all flags and arguments run $ python3 MakeSpritesFromFrames.py -h
        
	TROUBLESHOOTING:
	• If you end up with wonky looking filenames for your sprites, make sure your render folder is clean, 
	  only containing PNGs you wish to convert. Stray PNGs can cause trouble. 

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
__author__ = "Arlo Emerson <arloemerson@gmail.com>"
__version__ = "1.2"
__date__ = "5/23/2018"

import os
import sys
import glob
import subprocess
import shutil
import argparse
import textwrap
import lib.png_sprite_maker as _sprite_maker
import lib.text_colors as _text_colors
from lib.build_sprite_staging_dirs import BuildSpriteStagingDirs
from datetime import datetime as dt
from PIL import Image

class MakeSpritesFromFrames():
	'''Makes a 1 row sprite from PNGs.'''
	def __init__(self):
		print("Running " + _text_colors.HEADERLEFT3 + _text_colors.INVERTED + self.__class__.__name__ + " " + _text_colors.ENDC)
		
		self.working_dir = ""
		self.working_dir_short_name = ""
		self.staging_area_dir = ""
		self.sprite_staging_area = "__sprite_staging_area"
		self.vertical = None #default to horizontal sprites
		self.qset = None
		self.qset_list = [50, 60, 70, 75, 80, 85, 90, 95]
		self.output_type = "png"
		self.quality = 70
		self.encoder = "pillow"
		self.extent = 600
		self.verbose = False
		self.sprite_prefix = "sprite-"

		help_message = 'This script makes a 1 row sprite from PNGs that' + _text_colors.WARNING + ' HAVE NOT ' + _text_colors.ENDC + 'been output into specific directories. ' + \
		'Typically these would have been exported from After Effects as PNGs using ' + _text_colors.WHITE + '__generate_sequences_from_frames.jsx.' + _text_colors.ENDC

		parser = argparse.ArgumentParser(description=help_message, 
			epilog=textwrap.dedent('''Setup:
		• Place this script and the lib folder at the sibling level of the PNG folders you want to convert e.g. in your render/output folder.
		• Nothing to set, you just run the script. If there are directories containing PNGs, a sprite will be constructed for each unique set.'''), formatter_class=argparse.RawTextHelpFormatter)
		parser.add_argument('-vert', '--vertical', dest='vertical', action='store_true', help="For making vertical sprites. Default is horizontal.")
		parser.add_argument('-t', '--type', dest='type', required=False, help="For JPEG output use -type jpg|JPG|jpeg|JPEG. Default output is PNG.")
		parser.add_argument('-e', '--encoder', dest='encoder', required=False, help="The specific lib to use to encode the output. Default encoder is Pillow. Use -e imagemagic|magic to use the size constraint feature which looks something like: " + _text_colors.WHITE + "python3 MakeSpritesFromFrames.py -t jpg -e magic -x 700" + _text_colors.ENDC)
		parser.add_argument('-x', '--extent', dest='extent', required=False, help="Sets the extent flag in the ImageMagick conversion.")
		parser.add_argument('-q', '--quality', dest='quality', required=False, help="e.g. For JPEG with quality 80 use -q 80. Default quality is 70.")
		parser.add_argument('-qset', dest='qset', action='store_true', help="e.g. To export a range of quality settings 50 through 100. Default quality is 70.")
		parser.add_argument('-v','--verbose', dest='verbose', action='store_true', help="Explain what is being done.")		
		parser.add_argument('--version', action='version', version='%(prog)s ' + __version__)

		args = parser.parse_args()
		
		print("\n----- PREFLIGHT SUMMARY -----")

		if args.type:
			self.output_type = args.type.lower()
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

		if args.encoder:
			self.encoder = args.encoder.lower()
			print("Encoder type: " + args.encoder)
		else:
			print("Will save files using Pillow. Use -e magic to use the ImageMagick library.")

		if args.extent:
			self.extent = args.extent.lower()
			print("extent: " + args.extent)
		else:
			print("Will save at 600KB if magic was called. Use -x flag and pass in a number for kB.")

		if args.verbose:
			self.verbose = args.verbose
			if self.verbose == True:			
				print("Verbose mode")

		if args.qset:
			self.qset = args.qset
			print("qset is " + str(args.qset))
		else:
			if self.output_type != "png":
				print("qset ommited, will use JPG 70 quality.")

		if args.vertical:
			self.vertical = args.vertical
			print("Making vertical sprites.")
		else:
			print("Will create horizontal sprites.")

		if args.quality:
			self.quality = args.quality
			print("JPG quality set to " + str(args.quality))

			if "magic" in args.encoder:
				print( _text_colors.WARNING + "You set the quality flag to " + self.quality + " but encoder is ImageMagick with the default extent flag built in. If you want to set quality use the default encoder by omitting -e magic or using -e pillow." + _text_colors.ENDC)
		else:
			if self.output_type != "png":
				print("Will use JPG 70 quality.")

		print(_text_colors.DASH_LINE)

	def main(self):
		'''Main method of class.'''
		print(_text_colors.DASH_LINE)
		files = sorted( glob.glob( self.working_dir  + '*.png') )
		
		if len( files ) == 0:
			print(_text_colors.WARNING + "Found nothing to convert in " + _text_colors.ENDC + _text_colors.CYAN + self.working_dir + _text_colors.ENDC)
			return

		number_of_frames = len( files ) # this equates to number of frames in the sprite
		self.local_print(_text_colors.WHITE + "Number of frames: " + _text_colors.ENDC + _text_colors.CYAN + str( number_of_frames ) + _text_colors.ENDC)
		image_to_process=Image.open( files[0] )
		
		if self.vertical:
			processed_sprite = _sprite_maker.make_vertical_sprite(files,number_of_frames,image_to_process.size[0],image_to_process.size[1])
		else:
			processed_sprite = _sprite_maker.make_sprite(files,number_of_frames,image_to_process.size[0],image_to_process.size[1])
		
		string_directory = str(self.working_dir)
		file_name = self.sprite_prefix + self.working_dir_short_name + "." + self.output_type

		if self.output_type == "png":
			if processed_sprite:
				processed_sprite.save(file_name)
				self.print_sprite_complete(file_name)		
			else:
				print(_text_colors.FAIL + "Failed to make sprite " +  _text_colors.ENDC + _text_colors.WHITE + file_name + _text_colors.ENDC)
		else:
			if self.qset:
				qset = self.qset_list # 100 disables portions of the JPEG compression algorithm, and results in large files with hardly any gain in image quality.
				self.local_print(_text_colors.WHITE + "Using this qset: " + _text_colors.ENDC + _text_colors.CYAN + str( self.qset_list ) + _text_colors.ENDC)
			else:
				qset = [self.quality]
				self.local_print(_text_colors.WHITE + "Using JPG quality of "  + _text_colors.ENDC + _text_colors.CYAN + str( self.quality ) + _text_colors.ENDC)
			for q in qset:
				# if there is an alpha channel this will remove it
				dealpha_image = processed_sprite.convert("RGB")

				if self.encoder == "pillow":
					file_name = self.sprite_prefix + self.working_dir_short_name + "-q" + str(q) + ".jpg"
					full_file_path = file_name
					self.local_print(_text_colors.WHITE + "Quality set to " + str(q) + _text_colors.ENDC)
					dealpha_image.save(full_file_path, "JPEG", quality=int(q), optimize=True, progressive=True)	
					self.print_sprite_complete(full_file_path)					
				elif self.encoder == "magic" or self.encoder == "imagemagic":
					try:
						file_name = self.sprite_prefix + self.working_dir_short_name + ".jpg"
						full_file_path = file_name

						processed_sprite.save(full_file_path + ".png") # this is really a temp file
						self.local_print(_text_colors.WHITE + "Converting with " + _text_colors.ENDC + _text_colors.CYAN + str( self.extent ) + _text_colors.ENDC + _text_colors.WHITE + " kB extent" + _text_colors.ENDC)
						arg = "convert " + full_file_path + ".png -define jpeg:extent=" + str(self.extent) + "kB " + full_file_path
						self.local_print(_text_colors.DARKGREEN + arg + _text_colors.ENDC)
						os.system( arg )
						os.system( "rm " + full_file_path + ".png" ) # remove the temp file
						self.local_print(_text_colors.WHITE + "Removed a temp PNG file." + _text_colors.ENDC)
						self.print_sprite_complete(full_file_path)
						pass
					except Exception as e:
						print("If you're seeing this error, make sure you are passing in -e magic on the command line. Does not work from within SUBLIME.")
						raise e

	def print_sprite_complete(self, sprite_name):
		'''Message the user with process is complete.'''
		print("\nThe sprite " + _text_colors.KNOCKOUT + sprite_name + _text_colors.ENDC + " has been created.")	

	def local_print(self, message):
		'''Verbose printing.'''
		if self.verbose == True:
			print(message)

# Instantiate the sprite making class,
WORKER = MakeSpritesFromFrames()

# First thing we do is sort the PNGs into folders.
BuildSpriteStagingDirs().sort_images("png")

# Get our directories, assumes this script is running at sibling level to these folders.
try:
	dirs = next( os.walk('./' + WORKER.sprite_staging_area) )[1]
except Exception as e:
	print(_text_colors.ERROR_EMOJI)
	print(_text_colors.WARNING + "I couldn't find a __sprite_staging_area directory, so I failed here. " + _text_colors.ENDC + _text_colors.CYAN + "Things to try: Re-render your sprites using '__generate_sequences_from_frames.jsx' WITHOUT folders." + _text_colors.ENDC )
	raise e

# loop our dirs and make sprites
for dir in dirs:
	WORKER.working_dir_short_name = dir
	WORKER.working_dir = WORKER.sprite_staging_area + "/" + dir + "/" 
	try:
		WORKER.main()
	except Exception as e:
		print(_text_colors.ERROR_EMOJI)
		raise e

# Delete the __sprite_staging_area directory.
# print("Deleting the temp director " + _text_colors.CYAN + f.sprite_staging_area + _text_colors.ENDC)
# shutil.rmtree("__sprite_staging_area")
