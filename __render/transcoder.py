# -*- coding: utf8 -*-
'''
	USAGE
	• Place this script and the lib folder at the sibling level of the files
	  you want to convert e.g. in your render/output folder.
	• Nothing to set, you just run the script.
	• Run this against uncompressed AVIs or Apple ProRes files.
	• Creates transcoded versions of videos to YouTube/CBS/VAST specs. 
	  This typically includes:
		• 1920x1080 30 mbps
		• 1920x1080	2000 kbps
		• 1280x720 1000 kbps
		• 1280x720 800 kbps
		• 1280x720 700 kbps
		• 1280x720 500 kbps
		• audio only

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
__version__ = "1.7"
__date__ = "1/14/2020"

import sys
import os
import glob
import subprocess
import lib.text_colors as _text_colors

class Transcoder():	
	""" Transcodes video files into lower bit rate variants."""
	def __init__(self):
		print("Running " + _text_colors.HEADERLEFT2 + _text_colors.INVERTED + self.__class__.__name__ + " " + _text_colors.ENDC)

		self.outputs = [ ["30M", "1920x1080"], \
						 ["2000K", "1920x1080"], \
						 ["1000K", "1280x720"], \
						 ["800K", "1280x720"], \
						 ["700K", "1280x720"], \
						 ["500K", "1280x720"] ]		

		self.file_types = [".avi", ".mov"]

		# maintain for testing/fine-tuning problem videos
		# self.outputs = [ ["2000K", "1920x1080"] ]
		# self.tune_settings = ["film", "animation", "grain", "stillimage", "psnr", "ssim", "fastdecode", "zerolatency"]
		# self.speeds = ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow", "placebo"]

		# optimized settings
		self.tune_settings = ["zerolatency"]
		self.speeds = ["medium"]
		self.show_details = False

		self.total_transcoded = 0

	def main(self):		
		'''Loop the file types and inner-loop the output types.'''
		for file_type in self.file_types:
			for file_name in sorted(glob.glob("*"+file_type)):
				file_name = file_name.replace(" ", "\ ") # escape spaces in file_name 

				# Create video file.
				for output in self.outputs:
					for tune in self.tune_settings:
						for speed in self.speeds:
							bitRate = output[0]
							size = output[1]
							fileDetails = ""

							if self.show_details == True:
								fileDetails = tune + "_" + speed + "_"

							arg = "ffmpeg -i " + file_name + \
							" -s " + size + \
							" -vf format=rgb24" + \
							" -pix_fmt yuv420p" + \
							" -c:v libx264 -x264-params \"nal-hrd=cbr\"" + \
							" -probesize 5000000" + \
							" -b:v " + bitRate + \
							" -minrate " + bitRate + \
							" -maxrate " + bitRate + \
							" -bufsize " + bitRate + \
							" -acodec aac -strict -2" + \
							" -tune " + tune + \
							" -preset " + speed + \
							" -movflags faststart -y" + \
							" -force_key_frames 1 " + \
							file_name.replace(file_type, "_" + fileDetails + bitRate + ".mp4")
							os.system( arg )
							self.total_transcoded += 1

				# Create an audio only file.
				arg = "ffmpeg -i " + file_name + " -vn -acodec pcm_s16le -ar 44100 -ac 2 -y " + file_name.replace(file_type, ".wav")
				os.system( arg )

				self.total_transcoded += 1

				print(_text_colors.DASH_LINE)
				print("Transcoding done! " + _text_colors.CYAN + "Total files created: " + str(self.total_transcoded) + _text_colors.ENDC)

# Instantiate and run the class.
Transcoder().main()
