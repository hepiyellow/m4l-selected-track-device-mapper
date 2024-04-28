# STDMapper - Selected Track Device Mapper - WIP

## Work In Progress !!!

**This device is not ready yet !**

### Description

A M4L device for Ableton live.
This device allows you to map a MIDI controller to specific Device Parameters (By device name) on the _selected track_.

When you switch tracks, your controller will control the same Device Name on the newly selected track.

#### Features

- Auto Learn

### Setup workflow

This is my suggested setup:

- You put the STDMapper on a free MIDI track. You configure this track to receive and send MIID from/to your controller. Set MIDI monitoring to "In"
- You type in (In the STDM device text input field) the name of the Target Device you want to control.
- You click "Auto Learn" in the STDM device.
- You select a track where your have the Target device in it. Select the Device, click "Configure".
- Now you move a parameter value in the Device's UI, and then move a midi control, continue doing this for all params. And disable "Auto Learn" (In the STDM device)
- That's it, its working now.
- You store a preset of the STDM. Give it a name like "STDM [Target Device]". So you can use this mapping in other projects.
- You should also store a preset of the Target device (put inside a Rack first, and save a Rack preset), so the parameter list you "Configred" is stored. So you can re-use it in other tracks or projects.
