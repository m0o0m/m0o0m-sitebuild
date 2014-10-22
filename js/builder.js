/*

	Simplezite

*/


/* SETTINGS */

var pageContainer = "#page";

var editableItems = new Array();

editableItems['span.fa'] = ['color', 'font-size'];
editableItems['nav a, a.edit'] = ['color', 'font-weight', 'text-transform'];
editableItems['h1'] = ['color', 'font-size', 'background-color', 'font-family'];
editableItems['h2'] = ['color', 'font-size', 'background-color', 'font-family'];
editableItems['h3'] = ['color', 'font-size', 'background-color', 'font-family'];
editableItems['p'] = ['color', 'font-size', 'background-color', 'font-family'];
editableItems['a.btn'] = ['border-radius', 'font-size', 'background-color'];
editableItems['img'] = ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-color', 'border-style', 'border-width'];
editableItems['hr.dashed'] = ['border-color', 'border-width'];
editableItems['.divider > span'] = ['color', 'font-size'];
editableItems['hr.shadowDown'] = ['margin-top', 'margin-bottom'];

var editableItemOptions = new Array();

editableItemOptions['nav a : font-weight'] = ['400', '700'];
editableItemOptions['a.btn : border-radius'] = ['0px', '4px', '10px'];
editableItemOptions['img : border-style'] = ['none', 'dotted', 'dashed', 'solid'];
editableItemOptions['img : border-width'] = ['1px', '2px', '3px', '4px'];
editableItemOptions['h1 : font-family'] = ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman'];
editableItemOptions['h2 : font-family'] = ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman'];
editableItemOptions['h3 : font-family'] = ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman'];
editableItemOptions['p : font-family'] = ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman'];



/* FLAT UI PRO INITS */

$(function(){

	// Tabs
	$(".nav-tabs a").on('click', function (e) {
	  e.preventDefault();
	  $(this).tab("show");
	})

})


/* END SETTINGS */

var mainMenuWidth = 230;
var secondMenuWidth = 300;

$( window ).load(function() {

	$('#loader').fadeOut();

});


var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  	return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}


function pageEmpty() {

	if( $('#pageList ul:visible > li').size() == 0 ) {

		$('#start').show();

		$('#frameWrapper').addClass('empty');

	} else {

		$('#start').hide();

		$('#frameWrapper').removeClass('empty');

	}

}

function allEmpty() {

	var allEmpty = false;

	if( $('#pageList li').size() == 0 ) {

		allEmpty = true;

	} else {

		allEmpty = false;

	}

	if( allEmpty ) {

		$('a.actionButtons').each(function(){

			$(this).addClass('disabled');

		});

		$('header .modes input').each(function(){

			$(this).prop('disabled', true).parent().addClass('disabled');

		});

	} else {

		$('header .modes input').each(function(){

			$(this).prop('disabled', false).parent().removeClass('disabled');

		});

		$('a.actionButtons').each(function(){

			$(this).removeClass('disabled');

		});

	}

}


function makeDraggable(theID) {

	$('#elements li').each(function(){

		$(this).draggable({
			helper: function() {
				return $('<div style="height: 100px; width: 300px; background: #F9FAFA; box-shadow: 5px 5px 1px rgba(0,0,0,0.1); text-align: center; line-height: 100px; font-size: 28px; color: #16A085"><span class="fui-list"></span></div>');
			},
			revert: 'invalid',
			appendTo: 'body',
			connectToSortable: theID,
			stop: function(){

				pageEmpty();

				allEmpty();

			},
			start: function(){

				//switch to block mode
				$('input:radio[name=mode]').parent().addClass('disabled');
				$('input:radio[name=mode]#modeBlock').radio('check');

				//show all iframe covers and activate designMode

				$('#pageList ul .zoomer-wrapper .zoomer-cover').each(function(){

					$(this).show();

				})

				//deactivate designmode

				$('#pageList ul li iframe').each(function(){

					this.contentDocument.designMode = "off";

				})

			}
		});

	})

	$('#elements li a').each(function(){

		$(this).unbind('click').bind('click', function(e){

			e.preventDefault();

		})

	})

}

function makeSortable(el) {

	el.sortable({
		revert: true,
		placeholder: "drop-hover",
		beforeStop: function(event, ui){

			if( ui.item.find('.zoomer-cover > button').size() == 0 ) {

				if( ui.item.find('iframe').size() > 0 ) {

					theHeight = ui.item.height()/0.25;

					theHeight = theHeight*0.8;

					var attr = ui.item.find('iframe').attr('sandbox');

					if (typeof attr !== typeof undefined && attr !== false) {

						ui.item.html('<iframe src="'+ui.item.find('iframe').attr('src')+'" scrolling="no" frameborder="0" sandbox="allow-same-origin"><iframe>');

					} else {

						ui.item.html('<iframe src="'+ui.item.find('iframe').attr('src')+'" scrolling="no" frameborder="0"><iframe>');

					}

					ui.item.find('iframe').uniqueId();

					ui.item.find('iframe').zoomer({
			    		zoom: 0.8,
			    		width: $('#screen').width(),
			    		height: theHeight
					});


					//remove the link if it excists
					ui.item.find('.zoomer-cover a').remove();
					ui.item.find('.zoomer-cover').text('');


				} else {

					theHeight = ui.item.find('img').attr('data-height')*0.8;

					ui.item.html('<iframe src="'+ui.item.find('img').attr('data-src')+'" scrolling="no" frameborder="0"><iframe>');

					ui.item.find('iframe').uniqueId();

					ui.item.find('iframe').zoomer({
						zoom: 0.8,
						width: $('#screen').width(),
						height: theHeight,
						message: "Drag&Drop Me!"
					});

					ui.item.find('iframe').load(function(){

						heightAdjustment( ui.item.find('iframe').attr('id'), true );

					})


					//remove the link if it excists
					ui.item.find('.zoomer-cover a').remove();

				}

				//add a delete button
				delButton = $('<button type="button" class="btn btn-danger deleteBlock"><span class="fui-trash"></span> remove</button>');
				resetButton = $('<button type="button" class="btn btn-warning resetBlock"><i class="fa fa-refresh"></i> reset</button>')

				ui.item.find('.zoomer-cover').append( delButton )
				ui.item.find('.zoomer-cover').append( $('<div style="clear:both; height:0px">') )
				ui.item.find('.zoomer-cover').append( resetButton )

			}

		},
		stop: function(){

			$('#pageList ul:visible li').each(function(){

				$(this).find('.zoomer-cover > a').remove();

			});

		},
		over: function(){

			$('#start').hide();

		}
	});

}


function buildeStyleElements(el, theSelector) {

	for( x=0; x<editableItems[theSelector].length; x++ ) {

		//create style elements

		//alert( $(el).get(0).tagName )

		newStyleEl = $('#styleElTemplate').clone();

		newStyleEl.attr('id', '');
		newStyleEl.find('.control-label').text( editableItems[theSelector][x]+":" );

		if( theSelector+" : "+editableItems[theSelector][x] in editableItemOptions) {//we've got a dropdown instead of open text input

			//alert( theSelector+" "+editableItems[kkey][x] )

			newStyleEl.find('input').remove();

			newDropDown = $('<select></select>');
			newDropDown.attr('name', editableItems[theSelector][x]);

			for( z=0; z<editableItemOptions[ theSelector+" : "+editableItems[theSelector][x] ].length; z++ ) {

				newOption = $('<option value="'+editableItemOptions[theSelector+" : "+editableItems[theSelector][x]][z]+'">'+editableItemOptions[theSelector+" : "+editableItems[theSelector][x]][z]+'</option>');


				if( editableItemOptions[theSelector+" : "+editableItems[theSelector][x]][z] == $(el).css( editableItems[theSelector][x] ) ) {

					//current value, marked as selected
					newOption.attr('selected', 'true')

				}


				newDropDown.append( newOption )

			}

			newStyleEl.append( newDropDown );

			newDropDown.selectpicker({style: 'btn-sm btn-default', menuStyle: 'dropdown-inverse'});


		} else {

			newStyleEl.find('input').val( $(el).css( editableItems[theSelector][x] ) ).attr('name', editableItems[theSelector][x])

			if( editableItems[theSelector][x].indexOf("color") > -1 ) {

				//alert( editableItems[theSelector][x]+" : "+$(el).css( editableItems[theSelector][x] ) )

				if( $(el).css( editableItems[theSelector][x] ) != 'transparent' && $(el).css( editableItems[theSelector][x] ) != 'none' && $(el).css( editableItems[theSelector][x] ) != '' ) {

					newStyleEl.val( $(el).css( editableItems[theSelector][x] ) )

				}

				newStyleEl.find('input').spectrum({
					preferredFormat: "hex",
					showPalette: true,
					allowEmpty: true,
					showInput: true,
					palette: [
						["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
						["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
						["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
						["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
						["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
						["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
						["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
						["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
					]
				});

			}

		}



		newStyleEl.css('display', 'block');


		$('#styleElements').append( newStyleEl );


		$('#styleEditor form#stylingForm').height('auto')

	}

}


function heightAdjustment(el, par) {

	par = typeof par !== 'undefined' ? par : false;

	if( par == false ) {

		$('#pageList li:visible iframe').each(function(){

			theBody = $(this).contents().find('body');

			if( $.contains( document.getElementById( $(this).attr('id') ).contentWindow.document, el ) ) {

				frameID = $(this).attr('id');

			}

		})

		theFrame = document.getElementById(frameID);

	} else {

		theFrame = document.getElementById(el)

	}

	//realHeight = theFrame.contentWindow.document.body.offsetHeight;

	realHeight = theFrame.contentWindow.document.body.offsetHeight;

	//alert(theFrame.contentWindow.document.body.offsetHeight)

	$(theFrame).height( realHeight+"px" );

	$(theFrame).parent().height( (realHeight*0.8)+"px" );//.zoomer-small
	$(theFrame).parent().next().height( (realHeight*0.8)+"px" )//.zoomer-hoover
	$(theFrame).parent().parent().height( (realHeight*0.8)+"px" );//.zoomer-wrapper

}


var _oldIcon = new Array();


function styleClick(el) {

	theSelector = $(el).attr('data-selector');

	$('#editingElement').text( theSelector );


	//activate first tab
	$('#detailTabs a:first').click();


	//is the element an ancor tag?
	if( $(el).prop('tagName') == 'A' ) {

		$('a#link_Link').parent().show();

		$('a#img_Link').parent().hide();
		$('a#icon_Link').parent().hide();

		theHref = $(el).attr('href');

		zIndex = 0;

		pageLink = false;

		//the actual select

		$('select#internalLinksDropdown').prop('selectedIndex', 0);

		$('select#internalLinksDropdown option').each(function(){

			if( $(this).attr('value') == theHref ) {

				$(this).attr('selected', true);

				zIndex = $(this).index();

				pageLink = true;

			}

		})


		//the pretty dropdown
		$('.link_Tab .btn-group.select .dropdown-menu li').removeClass('selected');

		$('.link_Tab .btn-group.select .dropdown-menu li:eq('+zIndex+')').addClass('selected');

		$('.link_Tab .btn-group.select .filter-option').text( $('select#internalLinksDropdown option:selected').text() )

		if( pageLink == true ) {

			$('input#internalLinksCustom').val('');

		} else {

			$('input#internalLinksCustom').val( $(el).attr('href') )

		}


	} else if( $(el).prop('tagName') == 'IMG' ){

		$('a#img_Link').parent().show();

		$('a#icon_Link').parent().hide();
		$('a#link_Link').parent().hide();

		//set the current SRC
		$('.imageFileTab').find('input#imageURL').val( $(el).attr('src') )


		//reset the file upload
		$('.imageFileTab').find('a.fileinput-exists').click();


		$('a#link_Link').parent().hide();

	} else if( $(el).hasClass('fa') ) {

		$('a#icon_Link').parent().show();

		$('a#img_Link').parent().hide();
		$('a#link_Link').parent().hide();

		//get icon class name, starting with fa-
		var get = $.grep(el.className.split(" "), function(v, i){

			return v.indexOf('fa-') === 0;

		}).join();

		$('select#icons option').each(function(){

			if( $(this).val() == get ) {

				$(this).attr('selected', true);

				$('#icons').trigger('chosen:updated');

			}

		})

	} else {

		$('#detailTabs a:first').click();

		$('a#link_Link').parent().hide();

		$('a#img_Link').parent().hide();

	}


	//$(el).addClass('builder_active');

	//remove borders from other elements
	$('#pageList ul:visible li iframe').each(function(){

		//remove borders

		for( var key in editableItems ) {

			$(this).contents().find( pageContainer + ' '+ key ).css({'outline': 'none', 'cursor': 'default'});

			$(this).contents().find( pageContainer + ' '+ key ).hover( function(){

				$(this).css({'outline': '3px dashed red', 'cursor': 'pointer'})

			}, function(){

				$(this).css({'outline': 'none', 'cursor': 'default'})

			} )

		}

	});

	//unbind event
	$(el).unbind('mouseenter mouseleave');

	$(el).css({'outline': '3px dashed red', 'cursor': 'pointer'});



	//remove all style attributes

	$('#styleElements > *:not(#styleElTemplate)').each(function(){

		$(this).remove();

	})


	//load the attributes

	buildeStyleElements(el, theSelector)


	//show style editor if hidden

	if( $('#styleEditor').css('left') == '-300px' ) {

		$('#styleEditor').animate({'left': '0px'}, 250);

	}


	//save button
	$('button#saveStyling').unbind('click').bind('click', function(){

		$('#styleEditor #tab1 .form-group:not(#styleElTemplate) input, #styleEditor #tab1 .form-group:not(#styleElTemplate) select').each(function(){

			//alert( $(this).attr('name')+":"+$(this).val() )

			$(el).css( $(this).attr('name'),  $(this).val())

			if( $(el).prop('tagName') == 'A' ) {

				//change the href prop?

				if( $('select#internalLinksDropdown').val() != '#' ) {

					$(el).attr('href', $('select#internalLinksDropdown').val());

				} else if( $('input#internalLinksCustom').val() != '' ) {

					$(el).attr('href', $('input#internalLinksCustom').val());

				}

			}

		})


		//do we need to upload an image?
		if( $('a#img_Link').css('display') == 'block' && $('input#imageFileField').val() != '' ) {

			var form = $('form#imageUploadForm');

			var formdata = false;

			if (window.FormData){
				formdata = new FormData(form[0]);
			}

			var formAction = form.attr('action');

			$.ajax({
				url : formAction,
				data : formdata ? formdata : form.serialize(),
				cache : false,
				contentType : false,
				processData : false,
				dataType: "json",
				type : 'POST',
			}).done(function(response){

				if( response.code == 1 ) {//success

					$('input#imageURL').val( response.response );

					$(el).attr('src', response.response);

					//reset the file upload
					$('.imageFileTab').find('a.fileinput-exists').click();

				} else if( response.code == 0 ) {//error

					alert('Something went wrong: '+response.response)

				}

			})


		} else if( $('a#img_Link').css('display') == 'block' ) {


			//no image to upload, just a SRC change
			if( $('input#imageURL').val() != '' && $('input#imageURL').val() != $(el).attr('src') ) {

				$(el).attr('src', $('input#imageURL').val());

			}


		}


		//icons

		if( $(el).hasClass('fa') ) {

			//out with the old, in with the new :)
			//get icon class name, starting with fa-
			var get = $.grep(el.className.split(" "), function(v, i){

				return v.indexOf('fa-') === 0;

			}).join();

			//if the icons is being changed, save the old one so we can reset it if needed

			if( get != $('select#icons').val() ) {

				$(el).uniqueId();

				_oldIcon[$(el).attr('id')] = get;

				//alert( _oldIcon[el] )

			}

			$(el).removeClass( get ).addClass( $('select#icons').val() )

		}


		$('#detailsAppliedMessage').fadeIn(600, function(){

			setTimeout(function(){ $('#detailsAppliedMessage').fadeOut(1000) }, 3000)

		})

	});


	//delete button
	$('button#removeElementButton').unbind('click').bind('click', function(){

		if( $(el).prop('tagName') == 'A' ) {//ancor

			if( $(el).parent().prop('tagName') == 'LI' ) {//clone the LI

				toDel = $(el).parent();

			} else {

				toDel = $(el);

			}

		} else if( $(el).prop('tagName') == 'IMG' ) {//image

			if( $(el).parent().prop('tagName') == 'A' ) {//clone the A

				toDel = $(el).parent();

			} else {

				toDel = $(el);

			}

		} else {//everything else

			toDel = $(el);

		}

		$('#styleEditor').on('click', 'button#removeElementButton', function(){

			$('#deleteElement').modal('show');

			$('#deleteElement button#deleteElementConfirm').unbind('click').bind('click', function(){

				toDel.fadeOut(500, function(){

					randomEl = $(this).closest('body').find('*:first');

					toDel.remove();

					heightAdjustment(randomEl[0])

				})

				$('#deleteElement').modal('hide');

				closeStyleEditor();

			})

		})

	})


	//clone button
	$('button#cloneElementButton').unbind('click').bind('click', function(){

		if( $(el).parent().hasClass('propClone') ) {//clone the parent element

			theClone = $(el).parent().clone();
			theClone.find( $(el).prop('tagName') ).attr('style', '');

			theOne = theClone.find( $(el).prop('tagName') );
			cloned = $(el).parent();

			cloneParent = $(el).parent().parent();

		} else {//clone the element itself

			theClone = $(el).clone();
			theClone.attr('style', '');

			theOne = theClone;
			cloned = $(el);

			cloneParent = $(el).parent();

		}

		cloned.after( theClone );

		//theClone.insertAfter( cloned );


		for( var key in editableItems ) {

			$(el).closest('body').find( pageContainer + ' '+ key ).each( function(){

				if( $(this)[0] === $(theOne)[0] ) {

					theOne.hover( function(){

						$(this).css({'outline': '3px dashed red', 'cursor': 'pointer'})

					}, function(){

						$(this).css({'outline': 'none', 'cursor': 'default'})

					} ).click( function(e){

						e.preventDefault();

						e.stopPropagation();

						styleClick(this, key)


					} ).each( function(){

						$(this).attr('data-selector', key)

					} );

				}
			});

		}

		//possible height adjustments

		heightAdjustment(el);

	})


	//reset button
	$('button#resetStyleButton').unbind('click').bind('click', function(){

		$(el).attr('style', '').css({'outline': '3px dashed red', 'cursor': 'pointer'})

		$('#styleEditor form#stylingForm').height( $('#styleEditor form#stylingForm').height()+"px" );

		$('#styleEditor form#stylingForm .form-group:not(#styleElTemplate)').fadeOut(500, function(){

			$(this).remove()

		})

		//reset icon

		if( _oldIcon[$(el).attr('id')] != null ) {

			var get = $.grep(el.className.split(" "), function(v, i){

				return v.indexOf('fa-') === 0;

			}).join();

			$(el).removeClass( get ).addClass( _oldIcon[$(el).attr('id')] );

			$('select#icons option').each(function(){

				if( $(this).val() == _oldIcon[$(el).attr('id')] ) {

					$(this).attr('selected', true);

					$('#icons').trigger('chosen:updated');

				}

			})

		}

		setTimeout( function(){buildeStyleElements(el, theSelector)}, 550)

	})




}


function closeStyleEditor() {

	//only if visible

	if( $('#styleEditor').css('left') == '0px' ) {

		$('#styleEditor').animate({'left': '-300px'}, 250);

		$('#pageList ul li iframe').each(function(){

			//remove hover events used by Styling modus

			for( var key in editableItems ) {

				$(this).contents().find( pageContainer + ' '+ key ).unbind('mouseenter mouseleave click').css({'outline': 'none', 'cursor': 'default'});

			}


			if ( $('input:radio[name=mode]:checked').val() == 'styling' ) {

				$('#pageList ul li iframe').each(function(){

					for( var key in editableItems ) {

						$(this).contents().find( pageContainer + ' '+ key ).hover( function(){

							$(this).css({'outline': '3px dashed red', 'cursor': 'pointer'})

						}, function(){

							$(this).css({'outline': 'none', 'cursor': 'default'})

						} ).click( function(e){

							e.preventDefault();

							e.stopPropagation();

							styleClick(this, key)

						} );

					}

				})

			}

		})

	}

}


$(function(){

	//chosen font-awesome dropdown

	$('select#icons').chosen({
		'search_contains': true
	});

	//detect mode
	if( window.location.protocol == 'file:' ) {

		_mode = "local";

	} else {

		_mode = "server";

	}

	//check if formData is supported
	if (!window.FormData){

		//not supported, hide file upload
		$('form#imageUploadForm').hide();

		$('.imageFileTab .or').hide();

	}


	//internal links dropdown

	$('select#internalLinksDropdown').selectpicker({style: 'btn-sm btn-default', menuStyle: 'dropdown-inverse'})


	$('input#internalLinksCustom').focus(function(){

		$('select#internalLinksDropdown option').attr('selected', false);

		$('.link_Tab .dropdown-menu li').removeClass('selected');

		$('.link_Tab .btn-group.select > button .filter-option').text( $('.link_Tab .dropdown-menu li:first').text() )

		this.select();

	})


	$('#detailsAppliedMessageHide').click(function(){

		$(this).parent().fadeOut(500)

	})


	//hide style editor option?

	if( typeof editableItems === 'undefined' ) {

		$('#modeStyle').parent().remove();

	}

	$('#closeStyling').click(function(){

		closeStyleEditor();

	})


	$('#styleEditor form').on("focus", "input", function(){

		$(this).css('position', 'absolute');
		$(this).css('right', '0px')

		$(this).animate({'width': '100%'}, 500);

		$(this).focus(function(){
		    this.select();
		});

	}).on("blur", "input", function(){

		$(this).animate({'width': '42%'}, 500, function(){

			$(this).css('position', 'relative');
			$(this).css('right', 'auto');

		})

	})

	/*$('#toggle').click(function(){

		//change icon
		$(this).find('span').removeClass('fui-gear').addClass('fui-cross');

		if( $('#main').width() == 0 ) {//slide out

			$('#main').animate({
				width: mainMenuWidth
			}, 500);

			$('body').animate({
				paddingLeft: mainMenuWidth
			}, 500, function(){

				zoomm();

			});

		} else {//slide in

			$(this).find('span').removeClass('fui-cross').addClass('fui-gear');

			$('#main').animate({
				width: 0
			}, 500);

			$('body').animate({
				paddingLeft: 0
			}, 500, function(){

				var screenWidth = $('#screen').width();

				$('#pageList li').each(function(){

					$(this).find('.zoomer-wrapper').width( screenWidth );
					$(this).find('.zoomer-wrapper > *').width( screenWidth );

					$(this).find('.zoomer-wrapper iframe').width( screenWidth );

					$(this).find('.zoomer-wrapper iframe').contents().find('html').css('transform', 'none');

				});

			});

		}

	});*/






	for( var key in _Elements.elements ) {

		niceKey = key.toLowerCase().replace(" ", "_");

		$('<li><a href="" id="'+niceKey+'">'+key+'</a></li>').appendTo('#menu #main ul#elements');

		for( x=0; x<_Elements.elements[key].length; x++ ) {

			//alert( data.elements[key][x].url )


			if( _Elements.elements[key][x].thumbnail == null ) {//we'll need an iframe

				//build us some iframes!

				if( _Elements.elements[key][x].sandbox != null ) {

					newItem = $('<li class="element '+niceKey+'"><iframe src="'+_Elements.elements[key][x].url+'" scrolling="no" sandbox="allow-same-origin"></iframe></li>');

				} else {

					newItem = $('<li class="element '+niceKey+'"><iframe src="about:blank" scrolling="no"></iframe></li>');

				}

				newItem.find('iframe').uniqueId();

				newItem.find('iframe').attr('src', _Elements.elements[key][x].url);

			} else {//we've got a thumbnail

				newItem = $('<li class="element '+niceKey+'"><img src="'+_Elements.elements[key][x].thumbnail+'" data-src="'+_Elements.elements[key][x].url+'" data-height="'+_Elements.elements[key][x].height+'"></li>')

			}



			newItem.appendTo('#menu #second ul');



			//zoom zoom

			if( _Elements.elements[key][x].height ) {

				theHeight = _Elements.elements[key][x].height*0.25;

			} else {

				theHeight = 'auto'

			}

			newItem.find('iframe').zoomer({
				zoom: 0.25,
				width: 270,
				height: theHeight,
				message: "Drag&Drop Me!"
			});

		}

		//draggables
		makeDraggable( '#page1' )

	}



		//use function call to make the ULs sortable
		makeSortable( $('#pageList ul#page1') );

	//second menu animation
	$('#menu #main #elements').on('hover', 'a:not(.btn)', function(){

		$('#menu #main a').removeClass('active');
		$(this).addClass('active');

		//show only the right elements
		$('#menu #second ul li').hide();
		$('#menu #second ul li.'+$(this).attr('id')).show();

		if( $(this).attr('id') == 'all' ) {

			$('#menu #second ul li').show();

		}

		$('.menu .second').css('display', 'block').stop().animate({
			width: secondMenuWidth
		}, 500);


	})



	$('#menu #main').on('click', 'a:not(.actionButtons)', function(e){

		e.preventDefault();

	})

	$('#menu').mouseleave(function(){

		$('#menu #main a').removeClass('active');

		$('.menu .second').stop().animate({
			width: 0
		}, 500, function(){

			$('#menu #second').hide();

		});

	});


	//disable on load
	$('input:radio[name=mode]').parent().addClass('disabled');
	$('input:radio[name=mode]#modeBlock').radio('check');


	//design mode toggle
	$('input:radio[name=mode]').on('toggle', function(){

		if( $(this).val() == 'content' ) {

			//close style editor
			closeStyleEditor();

			//hide all iframe covers and activate designMode

			$('#pageList ul .zoomer-wrapper .zoomer-cover').each(function(){

				$(this).hide();

			})

			//activate designmode

			$('#pageList ul li iframe').each(function(){


				//remove hover events used by Styling modus

				for( var key in editableItems ) {

					$(this).contents().find( pageContainer + ' '+ key ).unbind('mouseenter mouseleave');

				}


				this.contentDocument.designMode = "on";

			})

		} else if( $(this).val() == 'block' ) {

			//close style editor
			closeStyleEditor();

			//show all iframe covers and activate designMode

			$('#pageList ul .zoomer-wrapper .zoomer-cover').each(function(){

				$(this).show();

			})

			//deactivate designmode

			$('#pageList ul li iframe').each(function(){


				for( var key in editableItems ) {

					$(this).contents().find( pageContainer + ' '+ key ).unbind('mouseenter mouseleave');

				}

				this.contentDocument.designMode = "off";

			})

		} else if( $(this).val() == 'styling' ) {

			//hide all iframe covers and activate designMode

			$('#pageList ul .zoomer-wrapper .zoomer-cover').each(function(){

				$(this).hide();

			})



			//active styling mode
			$('#pageList ul li iframe').each(function(){

				for( var key in editableItems ) {

					$(this).contents().find( pageContainer + ' '+ key ).hover( function(){

						$(this).css({'outline': '3px dashed red', 'cursor': 'pointer'})

					}, function(){

						$(this).css({'outline': 'none', 'cursor': 'default'})

					} ).click( function(e){

						e.preventDefault();

						e.stopPropagation();

						styleClick(this, key)


					} ).each( function(){

						$(this).attr('data-selector', key)

					} );

				}

			})

		}

	});


	//close styleEditor
	$('#styleEditor > a.close').click(function(e){

		e.preventDefault();

		closeStyleEditor();

	})


	//delete blocks from window

	var blockToDelete;

	$('#pageList').on("click", ".zoomer-cover > .deleteBlock", function(){

		$('#deleteBlock').modal('show');

		blockToDelete = $(this).closest('li');

		$('#deleteBlock').off('click', '#deleteBlockConfirm').on('click', '#deleteBlockConfirm', function(){

			$('#deleteBlock').modal('hide');

			blockToDelete.fadeOut(500, function(){

				$(this).remove();

				pageEmpty();

				allEmpty();

			})

		})

	});


	//reset block
	$('#pageList').on("click", ".zoomer-cover > .resetBlock", function(){

		$('#resetBlock').modal('show');

		frameToReset = $(this).closest('li').find('iframe');

		$('#resetBlock').off('click', '#resetBlockConfirm').on('click', '#resetBlockConfirm', function(){

			$('#resetBlock').modal('hide');

			frameToReset.zoomer('refresh');

		})

	});


	//export markup

	$('#exportModal').on('show.bs.modal', function (e) {

		$('#exportModal > form #exportSubmit').show('');

		$('#exportModal > form #exportCancel').text('Cancel & Close');

		closeStyleEditor();

	});

	$('#exportModal').on('shown.bs.modal', function (e) {

		//delete older hidden fields

		$('#exportModal form input[type="hidden"]').remove();

		//loop through all pages
		$('#pageList > ul').each(function(){

			//grab the skeleton markup

			newDocMainParent = $('iframe#skeleton').contents().find( pageContainer );

			//empty out the skeleton
			newDocMainParent.find('*').remove();

			//loop through page iframes and grab the body stuff

			$(this).find('iframe').each(function(){

				toAdd = $(this).contents().find( pageContainer ).html();

				//grab scripts

				scripts = $(this).contents().find( pageContainer ).find('script');

				if( scripts.size() > 0 ) {

					theIframe = document.getElementById("skeleton");

					scripts.each(function(){

						if( $(this).text() != '' ) {//script tags with content

							var script = theIframe.contentWindow.document.createElement("script");
							script.type = 'text/javascript';
							script.innerHTML = $(this).text();

							theIframe.contentWindow.document.getElementById( pageContainer.substring(1) ).appendChild(script);

						} else if( $(this).attr('src') != null ) {

							var script = theIframe.contentWindow.document.createElement("script");
							script.type = 'text/javascript';
							script.src = $(this).attr('src');

							theIframe.contentWindow.document.getElementById( pageContainer.substring(1) ).appendChild(script)

						}

					})

				}

				newDocMainParent.append( $(toAdd) );

			});

			//theStyle = $('<style>body{width:100%}</style>');

			//$('iframe#skeleton').contents().find('head').append( $('<style>body{width:100%}</style>') )

			//create the hidden input

			//alert( $('#pages li:eq('+$(this).index()+1+') a:first').text() )

			newInput = $('<input type="hidden" name="pages['+$('#pages li:eq('+($(this).index()+1)+') a:first').text()+']" value="">');

			$('#exportModal form').prepend( newInput );

			newInput.val( "<html>"+$('iframe#skeleton').contents().find('html').html()+"</html>" )

		})

	});



	$('#exportModal > form').submit(function(){

		$('#exportModal > form #exportSubmit').hide('');

		$('#exportModal > form #exportCancel').text('Close Window');

	})


	//clear screen
	$('#clearScreen').click(function(){

		$('#deleteAll').modal('show');

		$('#deleteAll').on('click', '#deleteAllConfirm', function(){

			$('#deleteAll').modal('hide');

			$('#pageList ul:visible li').fadeOut(500, function(){

				$(this).remove();

				pageEmpty();

				allEmpty();

			})

		})

	});


	//page menu buttons

	//add page

	$('#pages').on('blur', 'li > input', function(){

		if( $(this).parent().find('a.plink').size() == 0 ) {

			theLink = $('<a href="#'+$(this).val()+'" class="plink">'+$(this).val()+'</a>');

			$(this).hide();

			$(this).closest('li').prepend( theLink );

			$(this).closest('li').removeClass('edit');


			//update the page dropdown

			$('#internalLinksDropdown option:eq('+$(this).parent().index()+')').text( $(this).val() ).attr('value', $(this).val()+".html");

			$('select#internalLinksDropdown').selectpicker({style: 'btn-sm btn-default', menuStyle: 'dropdown-inverse'})

			//alert( ($(this).parent().index())+" : "+$(this).val() )


			$(this).remove();

		}

	})

	$('#addPage').click(function(e){

		e.preventDefault();

		//turn inputs into links
		$('#pages li.active').each(function(){

			if( $(this).find('input').size() > 0 ) {

				theLink = $('<a href="#">'+$(this).find('input').val()+'</a>');

				$(this).find('input').remove();

				$(this).prepend( theLink );

			}

		})

		$('#pages li').removeClass('active');

		newPageLI = $('#newPageLI').clone();
		newPageLI.css('display', 'block');
		newPageLI.find('input').val( 'page'+$('#pages li').size() );
		newPageLI.attr('id', '');

		$('ul#pages').append( newPageLI );


		theInput = newPageLI.find('input');

		theInput.focus();

		var tmpStr = theInput.val();
		theInput.val('');
		theInput.val(tmpStr);

		theInput.keyup( function(){

			$('#pageTitle span span').text( $(this).val() )

		} )

		newPageLI.addClass('active').addClass('edit');


		//create the page structure

		newPageList = $('<ul></ul>');
		newPageList.css('display','block');
		newPageList.attr('id', 'page'+($('#pages li').size()-1) );

		$('#pageList > ul').hide();
		$('#pageList').append( newPageList );


		makeSortable( newPageList );

		//draggables
		makeDraggable( '#'+'page'+($('#pages li').size()-1) )


		//alter page title
		$('#pageTitle span span').text( 'page'+($('#pages li').size()-1) );

		$('#frameWrapper').addClass('empty')
		$('#start').fadeIn();


		//add page to page dropdown

		newItem = $('<option value="'+'page'+($('#pages li').size()-1)+'.html">'+'page'+($('#pages li').size()-1)+'</option>')

		$('#internalLinksDropdown').append( newItem );

		$('select#internalLinksDropdown').selectpicker({style: 'btn-sm btn-default', menuStyle: 'dropdown-inverse'})

	})


	$('#pages').on('click', 'li:not(.active)', function(){

		$('#pageList > ul').hide();

		$('#pageList > ul:eq('+($(this).index()-1)+')').show();

		pageEmpty();

		//draggables
		makeDraggable( '#'+'page'+($(this).index()) )

		$('#pages li').removeClass('active').removeClass('edit');

		$(this).addClass('active');

		$('#pageTitle span span').text( $(this).find('a').text() );

	})


	$('#pages').on('click', 'li.active .fileSave', function(){

		//do something

		theLI = $(this).closest('li');

		if( theLI.find('input').size() > 0 ) {

			theLink = $('<a href="#'+theLI.find('input').val()+'">'+theLI.find('input').val()+'</a>');

			theLI.find('input').remove();

			theLI.prepend( theLink );

		}

		$('#pages li').removeClass('edit');

	});


	//edit page button

	$('#pages').on('click', 'li.active .fileEdit', function(){


		theLI = $(this).closest('li');

		newInput = $('<input type="text" value="'+theLI.find('a:first').text()+'" name="page">');

		theLI.find('a:first').remove();

		theLI.prepend( newInput );

		newInput.focus();

		var tmpStr = newInput.val();
		newInput.val('');
		newInput.val(tmpStr);

		newInput.keyup( function(){

			$('#pageTitle span span').text( $(this).val() )

		} )

		theLI.addClass('edit');

	})

	var theLIIndex;

	//delete page button
	$('#pages').on('click', 'li.active .fileDel', function(){

		theLIIndex = $(this).parent().parent().index();

		$('#deletePage').modal('show');

		$('#deletePageCancel').click(function(){

			$('#deletePage').modal('hide');

		})

		$('#deletePage').off('click').on('click', '#deletePageConfirm', function(){

			$('#deletePage').modal('hide');

			$('#pages li:eq('+theLIIndex+')').remove();

			$('#pageList ul:visible').remove();


			//update the page dropdown list

			$('select#internalLinksDropdown option:eq('+theLIIndex+')').remove();

			$('.link_Tab .dropdown-menu li:eq('+theLIIndex+')').remove();


			//activate the first page

			$('#pages li:eq(1)').addClass('active');

			$('#pageList ul:first').show();

			$('#pageTitle span span').text( $('#pages li:eq(1)').find('a:first').text() )


			//draggables
			makeDraggable( '#'+'page1' )


			//show the start block?

			pageEmpty();

			allEmpty();


		})

	})

})