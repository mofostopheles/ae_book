# -*- coding: utf8 -*-
'''
	USAGE
	• Place this script and the lib folder at the sibling level of the files
	  you want to convert e.g. in your render/output folder.
	• Run this against uncompressed AVIs or Apple ProRes files.
	• Creates Apple ProRes encoded MOV files.

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
__version__ = "1.1"
__date__ = "1/14/2020"

import sys
import os
import glob
import subprocess
import lib.text_colors as _text_colors

class Transcoder():	
	'''Creates Apple ProRes encoded MOV files.'''
	def __init__(self):
		print("Running " + _text_colors.HEADERLEFT2 + _text_colors.INVERTED + self.__class__.__name__ + " " + _text_colors.ENDC)

		self.file_types = [".mxf", ".avi"]
		self.total_transcoded = 0

	def main(self):		
		'''Loop the file types and inner-loop the output types.'''
		for file_type in self.file_types:
			for file_name in sorted(glob.glob("*"+file_type)):
				file_name = file_name.replace(" ", "\ ") # escape spaces in file_name 
				arg = "ffmpeg -i " + file_name + " -c:v prores -profile:v 3 -y " + file_name.replace(file_type, "_prores.mov")
				os.system( arg )

				self.total_transcoded += 1

				print(_text_colors.DASH_LINE)
				print("Transcoding done! " + _text_colors.CYAN + "Total files created: " + str(self.total_transcoded) + _text_colors.ENDC)

# Instantiate and run the class.
Transcoder().main()
