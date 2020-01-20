# -*- coding: utf8 -*-
'''
	USAGE
	• Place this script and the lib folder in your __render directory.
	• Copies files into the 'processed' directory.
	• Optionally deletes files.

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
__version__ = "1.0"
__date__ = "5/15/2019"

import sys
import os
import glob
import subprocess
import argparse

class Cleanup():	
	'''A simple cleanup routine for keeping the __render directory tidy.'''
	def __init__(self):
		print("Running '" + self.__class__.__name__ + "'...")
		self.delete_AVI = False
		self.delete_everything = False

		parser = argparse.ArgumentParser(description='Just a simple cleanup job.')
		parser.add_argument('-d', '--delete', dest='delete', action='store_true', help="Delete AVIs")
		parser.add_argument('-w', '--wipe', dest='wipe', action='store_true', help="Deletes *.mp4 *.png *.jpg *.mov *.avi *.wav")
		parser.add_argument('--version', action='version', version='%(prog)s ' + __version__)
		args = parser.parse_args()

		if args.delete:
			self.delete_AVI = True
			print("Will delete AVIs.")

		if args.wipe:
			self.delete_everything = True
			print("Will delete all rendered files after backup.")

	def main(self):	
		'''Copies files to processed directory and deletes specific types.'''	
		# TODO: Change -v to -vu on linux. -u Update is linux only.
		# TODO: Consider using rsync.
		arg = "cp *.mp4 *.png *.jpg *.mov *.avi *.zip *.tgz *.gz -v ./processed"
		os.system( arg )

		if self.delete_AVI:
			arg = "rm *.avi"
			os.system( arg )

		if self.delete_everything:
			arg = "rm *.mp4 *.png *.jpg *.mov *.avi *.wav"
			os.system( arg )

# Instantiate and run the script.
Cleanup().main()
