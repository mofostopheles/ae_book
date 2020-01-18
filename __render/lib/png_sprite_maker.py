# -*- coding: utf8 -*-
"""
	Utility module for making sprites.

	USAGE
	• Called by make_sprites_from_sequences.py and make_sprites_from_frames.py

	LICENSE
		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU Lesser General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
		GNU Lesser General Public License for more details.

		You should have received a copy of the GNU Lesser General Public License
		along with this program.	If not, see <https://www.gnu.org/licenses/>.
"""
from PIL import Image
import lib.text_colors as _text_colors

__author__ = "Arlo Emerson <arloemerson@gmail.com>"
__version__ = "2.1"
__date__ = "1/14/2020"

def make_sprite(file_names, frame_count, image_width, image_height):
	"""Typically called by upstream process, make_sprites_from_sequences.py"""

	image_dimensions = ((frame_count * image_width), image_height)
	tmp_transparency_mask = Image.new('RGBA', (image_width, image_height), (255, 255, 255))
	new_image = Image.new('RGBA', (image_dimensions[0], image_dimensions[1]))
	x_position = 0
	tmp_counter = 0

	for i in range(frame_count):
		tmp_image = None

		try:
			tmp_image = Image.open(file_names[tmp_counter])
			tmp_counter += 1

		except Exception as exception:
			print(exception)
		else:
			pass

		x_position = (image_width * i)

		try:
			new_image.paste(tmp_image, (x_position, 0), tmp_transparency_mask)
		except ValueError:
			new_image.paste(tmp_image, (x_position, 0))
			print_transparency_mask_error()
			return None

	return new_image

def print_transparency_mask_error():
	"""Error will get thrown when pasting PNGs of varying sizes, basically
	the transparency mask doesn't match up."""

	print(_text_colors.ERROR_EMOJI)
	print(_text_colors.FAIL +	"Error pasting the transparency mask.\n" + _text_colors.ENDC + \
				"This is usually caused when the source PNGs are not the same size.\n" + \
				"Check that the PNGs from each comp in their own individual folders,\n" + \
				"either in your render folder or in the __sprite_staging_area folder.")

def make_vertical_sprite(file_names, frame_count, image_width, image_height):
	"""Same logic as elsewhere, just build the sprite along the y axis."""

	image_dimensions = (image_width, (frame_count * image_height))
	tmp_transparency_mask = Image.new('RGBA', (image_width, image_height), (255, 255, 255))
	new_image = Image.new('RGBA', (image_dimensions[0], image_dimensions[1]))
	y_position = 0
	tmp_counter = 0

	for i in range(frame_count):

		tmp_image = None
		try:
			tmp_image = Image.open(file_names[tmp_counter])
			tmp_counter += 1

		except Exception as exception:
			print(exception)
		else:
			pass

		y_position = (image_height * i)

		try:
			new_image.paste(tmp_image, (0, y_position), tmp_transparency_mask)
		except ValueError:
			new_image.paste(tmp_image, (0, y_position))
			print_transparency_mask_error()
			return None

	return new_image

def make_jpg_sprite(file_names, frame_count, image_width, image_height):
	"""This is maintained for backwards compat with older scripts calling here."""

	image_dimensions = ((frame_count * image_width), image_height)
	new_image = Image.new('RGB', (image_dimensions[0], image_dimensions[1]))
	x_position = 0
	tmp_counter = 0

	for i in range(frame_count):

		tmp_image = None
		try:
			tmp_image = Image.open(file_names[tmp_counter])
			tmp_counter += 1

		except Exception as exception:
			print(exception)
		else:
			pass

		x_position = (image_width * i)
		new_image.paste(tmp_image, (x_position, 0))

	return new_image
