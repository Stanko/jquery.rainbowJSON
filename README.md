jquery.rainbowJSON
==================

JSON pretty print, jQuery plugin.
Takes JSON in plain text format, and make it way more readable and colorful :) you can choose depth of the recursion and maximum children elements which will be printed. Similar to var_dump() in php.

Usage
-----
<pre>
$('.makeItNice').rainbowJSON({
    maxElements: 0, // maximum elements per object that will be printed (0 is unlimited)
    maxDepth: 0, // maximum depth for recursive printing (0 is unlimited)
    plainJSON: '', // json in plain text format (if empty, html of the object will be used)
    bgColor: '#F5FAFF' // background color of the div, which will be used for shading
});
</pre>

Example
-------

![rainbowJSON in action](http://i.imgur.com/EHkskh9.png "You can see different options used, and syntax error")

Option used in image above:

<pre>
$('.makeItNice').rainbowJSON({
	maxElements: 7,
	maxDepth: 4
});

$('.makeItNiceGreen').rainbowJSON({
	maxElements: 3,
	maxDepth: 3,
	bgColor: '#D8FFF2'
});
</pre>
