(function(window, document, angular, undefined) {
	'use strict';
    
	angular.module('ngTypable', [])
		.value('config', {})
        .directive('typable', ['$timeout', function($timeout) {
        	return {
        	    restrict: 'A',
        		scope: false,
        		link: function(scope, elements, attrs) {
        			var children = elements[0].children;
        			
        			var statements = [];
        			
        			var adjacentCharacters = {
        				a:['s','q','z'],
        				b:['v','n','g'],
        				c:['x','v','d'],
        				d:['c','f','s','e'],
        				e:['w','r','d'],
        				f:['d','g','r','v'],
        				g:['b','f','h','t'],
        				h:['y','j','n','g'],
        				i:['o','k','u'],
        				j:['u','k','m','h'],
        				k:['i','l','m','j'],
        				l:['o',';','.','k'],
        				m:['j','k',',','n'],
        				n:['h','j','m','b'],
        				o:['i','p','l'],
        				p:['o','[',';'],
        				q:['w','s','a'],
        				r:['e','t','f'],
        				s:['w','d','x','a'],
        				t:['r','y','g'],
        				u:['y','i','j'],
        				v:['c','f','g','b'],
        				w:['q','e','s'],
        				x:['z','s','d','c'],
        				y:['t','u','h'],
        				z:['a','s','x'],
        				A:['S','Q','Z'],
        				B:['V','N','G'],
        				C:['X','V','D'],
        				D:['C','F','S','E'],
        				E:['W','R','D'],
        				F:['D','G','R','V'],
        				G:['B','F','H','T'],
        				H:['Y','J','N','G'],
        				I:['O','K','U'],
        				J:['U','K','M','H'],
        				K:['I','L','M','J'],
        				L:['O',';','.','K'],
        				M:['J','K',',','N'],
        				N:['H','J','M','B'],
        				O:['I','P','L'],
        				P:['O','[',';'],
        				Q:['W','S','A'],
        				R:['E','T','F'],
        				S:['W','D','X','A'],
        				T:['R','Y','G'],
        				U:['Y','I','J'],
        				V:['C','F','G','B'],
        				W:['Q','E','S'],
        				X:['Z','S','D','C'],
        				Y:['T','U','H'],
        				Z:['A','S','X'],
        				'1':['`','2'],
        				'2':['1','3'],
        				'3':['2','4'],
        				'4':['3','5'],
        				'5':['4','6'],
        				'6':['5','7'],
        				'7':['6','8'],
        				'8':['7','9'],
        				'9':['8','0'],
        				'0':['9','-'],
        				'-':['0','='],
        				'=':['-'],
        				'`':['1'],
        				'[':['p','-',']',';'],
        				']':['=','\\','\'','['],
        				';':['p','\'','/','l'],
        				'\'':['[','/',';'],
        				',':['k','l','.','m'],
        				'.':['l',';','/',','],
        				'/':[';','\'','.'],
        				'\\':[']'],
        				'!':['~','@'],
        				'@':['!','#'],
        				'#':['@','$'],
        				'$':['#','%'],
        				'%':['$','^'],
        				'^':['%','&'],
        				'&':['^','*'],
        				'*':['&','('],
        				'(':['*',')'],
        				')':['(','_'],
        				'_':[')','+'],
        				'+':['_'],
        				'~':['!'],
        				'{':['P','_','}',':'],
        				'}':['+','|','"','{'],
        				':':['P','"','?','L'],
        				'"':['{','?',':'],
        				'<':['K','L','>','M'],
        				'>':['L',':','?','<'],
        				'?':[':','"','>'],
        				'|':['}']
        			};
        			
        			for (var i = 0; i < children.length; i++) {
        				var type = children[i].tagName.toLowerCase();
        				
        				if (type == "li") {
        					d3.select(children[i]).selectAll("eval").each(function (d, i) {
        						this.innerHTML = eval(this.innerHTML);
        					});
        					statements.push(children[i].textContent);
        				}
        			}
        			
        			elements[0].innerHTML = "";
        			
        			var text = d3.select(elements[0]).append("span");
        			var caret = d3.select(elements[0]).append("span").classed("caret", true).html("|");
        			
        			if (statements.length > 0) {
        				var i = 0;
        				var position = 0;
        				var statement = statements[i];
        				var direction = 1;
        				
        				var letterDelay = parseFloat(attrs.delay) || 60;
        				var pauseDelay = parseFloat(attrs.pauseDelay) || 2000;
        				var emptyPauseDelay = parseFloat(attrs.emptyPauseDelay) || 1000;
        				var startDelay = parseFloat(attrs.startDelay) || 0;
        				var screwupFixDelay = parseFloat(attrs.screwupFixDelay) || 200;
        				var screwupChance = parseFloat(attrs.screwupChance) || 20;
        				
        				var screwups = typeof attrs.screwups !== 'undefined';
        				
        				var screwupCharacter;
        				
        				function write(delay) {
        					if (!screwupCharacter) {
        						if (direction > 0) {
        							if (screwups && Math.floor(Math.random() * screwupChance) == 0) {
        								var characters = adjacentCharacters[statement[position]];
        								
        								if (characters) {
        									screwupCharacter = characters[Math.floor(Math.random() * characters.length)];
        									
        									delay = screwupFixDelay;
        								}
        							}
        							
        							text.html(text.html() + (screwupCharacter || statement[position]));
        						} else {
        							text.html(text.html().substring(0, position));
        						}
        						
        						caret.classed("active", false);
        						
        						if (!screwupCharacter) {
        							if ((position += direction) == 0) {
        								i = (i + 1) % statements.length;
        								
        								statement = statements[i];
        								
        								direction = 1;
        								
        								text.html("");
        								
        								delay = emptyPauseDelay;
        							} else if (direction > 0 && position >= statement.length) {
        								direction = -1;
        								
        								position--;
        								
        								delay = pauseDelay;
        							} else {
        								caret.classed("active", true);
        							}
        						}
        					} else {
        						text.html(text.html().substring(0, position));
        						
        						screwupCharacter = undefined;
        						
        						delay = screwupFixDelay;
        					}
        					
        					$timeout(write, delay || letterDelay);
        				}
        				
        				$timeout(write, startDelay);
        			}
        		}
        	};
        }]).provider('typableConfig', function() {
			var self = this;
			this.config = {};
			this.$get = function() {
				var extend = {};
				extend.config = self.config;
				return extend;
			};
			return this;
		});
})(window, document, angular);