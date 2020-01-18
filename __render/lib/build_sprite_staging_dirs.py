#!/usr/bin/env python
# -*- coding: utf8 -*-

__author__ = "Arlo Emerson <arloemerson@gmail.com>"
__version__ = "1.2"
__date__ = "2/6/2018"

'''This is a sorting and filing routine. I would have liked to use After Effects's built in subfolders for image sequences, except you can't modify the folder name from the code. So we do this, build folders from the filenames. Bad things start happening with malformed collections of images. 
A temp directory named "__sprite_staging_area" is created and where sub folders for each image sequence are moved to. This folder is later trashed by a higher-level script.'''

import os, glob
import lib.text_colors as _text_colors

class BuildSpriteStagingDirs():

	def __init__(self):
		self.sprite_staging_area = "__sprite_staging_area"
		print("Running " + _text_colors.HEADERLEFT + _text_colors.INVERTED + self.__class__.__name__ + " " + _text_colors.ENDC)

	def rename(path, old, new):
	    for f in os.listdir(path):
	        os.rename(os.path.join(path, f), 
	                  os.path.join(path, f.replace(old, new)))

	def make_dir(self, directory_name):
		print(_text_colors.OKGREEN + "Making directory " + _text_colors.ENDC + _text_colors.CYAN + directory_name + _text_colors.ENDC)

		if not os.path.exists(directory_name):
			os.makedirs(directory_name)

	def sort_images(self, image_type="png"):
		# loop a list of image sequences
		# identify unique groups of "frameN"

		try:
			previous_frame_string = ""
			image_list = []
			
			sorted_count = 0
			for name in sorted(glob.glob('*.'+image_type)):
				current_frame_string = name[ 0: -10 ]

				if previous_frame_string != current_frame_string: 
					#first item in a group, let's make a folder
					string_dir_name = name[ 0:name.find("_") ]
					self.make_dir( self.sprite_staging_area + "/" + string_dir_name )				

				os.rename( name,  self.sprite_staging_area + "/" + string_dir_name + "/" + name )
				print(_text_colors.OKGREEN + "Moving " + name + " to " + _text_colors.ENDC + _text_colors.CYAN + string_dir_name + _text_colors.ENDC)
				previous_frame_string = current_frame_string
				sorted_count += 1

			print(_text_colors.WARNING + str(sorted_count) + _text_colors.ENDC + _text_colors.CYAN + " files were sorted." + _text_colors.ENDC)
			return sorted_count
		except Exception as e:
			print(_text_colors.ERROR_EMOJI)
			raise e

# uncomment to just test this class, else it is called by higher level function
# sm = BuildSpriteStagingDirs()
# sm.sort_images()
