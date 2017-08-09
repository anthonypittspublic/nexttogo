"# nexttogo" 
This is a quick vue version of a next to go module.

Starting: There is a webpack script called "npm run build" that if you run from the command line as admin it will host the dev version at http://localhost:8080/src/
Alternatively you can run it from the file system

I had a major issue with CORS when testing this on localhost and from the file://. The best way around this are running it in chrome with the CORS "Allow-Control-Allow-Origin: *" plugin that allows CORS sharing.

I completed it within about 2 days of work from scratch to keep within the 48 hour limit, which if why I didn't get to finish up some of the things I wanted. It was my first ever tip toe into Vue.js so it's a good start.

THINGS TO DO:

It could do with quite a bit of work in the JS, as it has very little error checking.

Sort out a better resolution to the CORS issue (not many options from what I researched).

There could be some asynch issue in the foreach loops that I wanted to turn into promise resolves so it would be more iron clad.

There are certainly edge cases I wanted to deal with better, for example, two races running at exactly the same time.