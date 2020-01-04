#!/usr/bin/env python
# -*- coding: utf8 -*-

__author__ = "Arlo Emerson <arloemerson@gmail.com>"
__version__ = "2"
__date__ = "1/3/2020"

"""
	SCRIPT: 
	png_sprite_maker.py

	SYNOPSIS:
	Utility module for making sprites.

	USAGE:
	• Called by make_sprites_from_sequences.py
"""

"""
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
"""
from PIL import Image
import TextColors as _text_colors

def make_sprite(p_file_names,p_frame_count,p_image_width,p_image_height):

	image_dimensions = ((p_frame_count*p_image_width),p_image_height)
	tmp_transparency_mask = Image.new('RGBA', (p_image_width, p_image_height), (255, 255, 255) )
	new_image = Image.new('RGBA', (image_dimensions[0], image_dimensions[1]) )
	x_position = 0
	tmp_counter = 0

	for i in range(p_frame_count):

		new_width = 0
		new_height = 0
		img = None

		try:
			img = Image.open(p_file_names[tmp_counter])
			tmp_counter += 1
			image_bounding_box = img.getbbox()
			width = image_bounding_box[2] - image_bounding_box[0]
			height = image_bounding_box[3] - image_bounding_box[1]
			new_dimension = (width, height)

		except Exception as e:
			print(e)
		else: 
			pass

		x_position = (p_image_width * i)
		
		# There's an intermittant bug with the mask....
		# It actually might have to do with more than one sized PNG sneaking into the collection.
		# anyway, sometimes that line fails so a temp workaround is presented:
		try:
			new_image.paste(img, (x_position, 0), tmp_transparency_mask)
		except ValueError:
			new_image.paste(img, (x_position, 0))
			print_transparency_mask_error()
			return None
		
	return new_image

def print_transparency_mask_error():
	print("¯\\_( :-/ )_/¯  Whooops!")
	print(_text_colors.FAIL +  "Error pasting the transparency mask. " + _text_colors.ENDC + \
				"This is usually caused when the source PNGs are not the same size. Check that the PNGs from each comp in their own individual folders, either in your render folder or in the __sprite_staging_area folder. ")

def make_vertical_sprite(p_file_names,p_frame_count,p_image_width,p_image_height):

	image_dimensions = (p_image_width,(p_frame_count*p_image_height))

	# test area, trying to use this for all 
	tmp_transparency_mask = Image.new('RGBA', (p_image_width, p_image_height), (255, 255, 255) )
	new_image = Image.new('RGBA', (image_dimensions[0], image_dimensions[1]) )

	# new_image = Image.new('RGB', (image_dimensions[0], image_dimensions[1]) )
	y_position = 0
	tmp_counter = 0

	for i in range(p_frame_count):

		new_width = 0
		new_height = 0
		img = None
		try:
			img = Image.open(p_file_names[tmp_counter])
			tmp_counter += 1
			image_bounding_box = img.getbbox()

			width = image_bounding_box[2] - image_bounding_box[0]
			height = image_bounding_box[3] - image_bounding_box[1]

			new_dimension = (width, height)

		except Exception as e:
			print(e)
		else: 
			pass

		y_position = (p_image_height * i)		
		# new_image.paste(img, (0, y_position))		
		
		# there's an intermittant bug with the mask.
		# it actually might have to do with more than one sized PNG sneaking into the collection.
		# anyway, sometimes that line fails so a temp workaround is presented:
		try:
			new_image.paste(img, (0, y_position), tmp_transparency_mask)
		except ValueError:
			new_image.paste(img, (0, y_position))
			print_transparency_mask_error()
			return None

	return new_image

# this is maintained for backwards compat with older scripts calling here
def make_jpg_sprite(p_file_names,p_frame_count,p_image_width,p_image_height):

	image_dimensions = ((p_frame_count*p_image_width),p_image_height)

	new_image = Image.new('RGB', (image_dimensions[0], image_dimensions[1]) )
	x_position = 0
	tmp_counter = 0

	for i in range(p_frame_count):

		new_width = 0
		new_height = 0
		img = None
		try:
			img = Image.open(p_file_names[tmp_counter])
			tmp_counter += 1
			image_bounding_box = img.getbbox()

			width = image_bounding_box[2] - image_bounding_box[0]
			height = image_bounding_box[3] - image_bounding_box[1]

			new_dimension = (width, height)

		except Exception as e:
			print(e)
		else: 
			pass

		x_position = (p_image_width * i)		
		new_image.paste(img, (x_position, 0))		
		
	return new_image
