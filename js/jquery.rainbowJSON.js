;(function ( $, window, document, undefined ) {
    // Defaults
    var pluginName = 'rainbowJSON',
        defaults = {
            maxElements: 0, // maximum elements per object that will be printed
            maxDepth: 0, // maximum depth for recursive printing
            plainJSON: '', // json in plain text format (if empty, html of the object will be used)
            bgColor: '#F5FAFF' // background color of the div, which will be used for shading
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = $(element);

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        rainbowDiv : false,
        depth : 0,

        init: function() {
            var syntaxError = false;

            if(this.options.plainJSON == ''){
                this.options.plainJSON = $.trim(this.element.html());
            }
            try{
                var jsonObject = JSON.parse(this.options.plainJSON);
            }
            catch(e){
                syntaxError = e;
            }

            var html = '';
            
            // All necessary HTML and plain text JSON
            html += '<div class="rainbowJSON">';
                html += '<a href="javascript:void(0);" onclick="$(this).next(\'.plainJSON\').toggle();">Show plain JSON</a>';
                html += '<pre class="plainJSON">' + this.options.plainJSON + '</pre>';
                html += '<div class="formattedJSON" style="background-color: '+this.options.bgColor+'"></div>';
            html += '</div>';

            this.element.html(html);

            this.rainbowDiv = this.element.find('div.formattedJSON');

            if(syntaxError){
                html = syntaxError;
            }
            else{
                html = '<div>{';
                html += this.loopObject(jsonObject);    
                html += '}</div>';
            }

            this.rainbowDiv.append(html);
        },

        loopObject :function(object){
            var html = '';
            var brackets, value, type, emptyArray, innerHTML;

            this.depth++;

            if(this.options.maxDepth > 0 && this.depth > this.options.maxDepth){
                this.depth--;
                return '<div class="rainbowEmpty">*maximum depth reached*</div>';
            }


            var i = 0;
            for (var property in object) {
                if(this.options.maxElements > 0 && ++i > this.options.maxElements){
                    html += '<div class="rainbowEmpty">*maximum elements per object reached*</div>';
                    break;
                }

                emptyArray = false;
                brackets = ['{', '}'];
                value = object[property];
                type = typeof(object[property]);
                
                html += '<div>';
                
                // Objects and arrays
                if(type == 'object' && value != null ){
                    if (typeof(value.push) == 'function') { 
                        brackets = ['[', ']'];
                    }

                    html += property + ' : ';
                    html += brackets[0];

                    recursiveHtml = this.loopObject(value);

                    if(recursiveHtml == ''){
                        html += '<span class="rainbowEmpty"> *empty* </span>';
                    }
                    else{
                        html += ' <a href="javascript:void(0)" onclick="$(this).next(\'span\').toggle();" class="rainbowToggle">&raquo;</a> ';
                        html += '<span class="rainbowArray" style="background-color: '+this.shadeColor(this.options.bgColor, this.depth)+'">';
                        html += recursiveHtml;
                        html += '</span>';    
                    }
                    html += brackets[1];

                }
                // Strings, numbers, booleans and nulls
                else{
                    if( value == null ){
                        value = 'null';
                        type = 'null';
                    }
                    html += property + ' : <span class="rainbowValue ' + type + '">' + value + '</span> <span class="rainbowType">(' + type + ')</span>';
                }
                html += '</div>';
            }

            this.depth--;

            return html;
        },
        // returns darker color for shading objects in depth
        shadeColor : function(color, depth) {
            var R = parseInt(color.substring(1,3),16)
            var G = parseInt(color.substring(3,5),16)
            var B = parseInt(color.substring(5,7),16);

            R = parseInt(R * (100 + depth*-2) / 100);
            G = parseInt(G * (100 + depth*-2) / 100);
            B = parseInt(B * (100 + depth*-2) / 100);

            R = (R<255)?R:255;  
            G = (G<255)?G:255;  
            B = (B<255)?B:255;  

            var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
            var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
            var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

            return "#"+RR+GG+BB;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {

        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }

        });
    };

})( jQuery, window, document );