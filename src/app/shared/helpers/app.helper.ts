/*
 * Application helper functions:
 *
 * sidebarCollpasedMenu() - Sidebar collapsed nested menu
 * collapsedMenu() - Collpased menu
 * detectBody() - Detect windows size
 * smoothlyMenu() - Add smooth fade in/out on navigation show/hide
 * loadDepartmentMenu() - Load department details checkboxes
 *
*/

declare var $: any;

export class RegExpEnum {
	public static readonly phone_regular_expression = /^(?:[+])?(\d[ -]?){1,15}$/;
	public static readonly url_regular_expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/;
	public static readonly email_regular_expression = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
}

export function sidebarCollpasedMenu() {
	let $sidebar = $('.app-sidebar'),
	$sidebar_content = $('.sidebar-content'),
	$sidebar_img = $sidebar.data('image'),
	$sidebar_img_container = $('.sidebar-background'),
	$wrapper = $('.wrapper');    

	if( $sidebar_img_container.length !== 0 && $sidebar_img !== undefined ){
		$sidebar_img_container.css('background-image','url("' + $sidebar_img + '")');
	}

	if(!$wrapper.hasClass('nav-collapsed')){
		$sidebar_content.find('li.active').parents('li').addClass('open');
	}


	$sidebar_content.on('click', '.navigation li a',function(){
		let $this = $(this),
		listItem = $this.parent('li');

		if(listItem.hasClass('has-sub') && listItem.hasClass('open')){
			collapse(listItem);
		} else {
			if(listItem.hasClass('has-sub')){
				expand(listItem);
			}
			// If menu collapsible then do not take any action
			if ($sidebar_content.data('collapsible')) {
				return false;
			}
			// If menu accordion then close all except clicked once
			else {
				let openListItems = listItem.siblings('.open');
				collapse(openListItems);
				listItem.siblings('.open').find('li.open').removeClass('open');
			}
		}
	});

	function collapse($listItem, callback = false) {
		var $subList = $listItem.children('ul');

		$subList.show().slideUp(200, function() {
			$(this).css('display', '');

			$(this).find('> li').removeClass('is-shown');

			$listItem.removeClass('open');
		});
	}



	function expand($listItem, callback = false) {
		var $subList = $listItem.children('ul');
		var $children = $subList.children('li').addClass('is-hidden');

		$listItem.addClass('open');

		$subList.hide().slideDown(200, function() {
			$(this).css('display', '');
		});

		setTimeout(function() {
			$children.addClass('is-shown');
			$children.removeClass('is-hidden');
		}, 0);
	}

	$(document).on('click', '.logo-text', function(e) {
		var listItem = $sidebar_content.find('li.open.has-sub'),
		activeItem = $sidebar_content.find('li.active');

		if(listItem.hasClass('has-sub') && listItem.hasClass('open')){
			collapse(listItem);
			listItem.removeClass('open');
			if(activeItem.closest('li.has-sub')){
				let openItem = activeItem.closest('li.has-sub');
				expand(openItem);
				openItem.addClass('open');
			}
		} else {
			if(activeItem.closest('li.has-sub')){
				let openItem = activeItem.closest('li.has-sub');
				expand(openItem);
				openItem.addClass('open');
			}
		}
	});

	$(document).on('click', '.nav-toggle', function(e) {
		this.collapsedMenu();
	});

	$sidebar.on('mouseenter', function() {
		if($wrapper.hasClass('nav-collapsed')){
			$wrapper.removeClass('menu-collapsed');
			let $listItem = $('.navigation li.nav-collapsed-open'),
			$subList = $listItem.children('ul');

			$subList.hide().slideDown(300, function() {
				$(this).css('display', '');
			});

			$listItem.addClass('open').removeClass('nav-collapsed-open');
		}
	}).on('mouseleave', function(event) {
		if($wrapper.hasClass('nav-collapsed')){
			$wrapper.addClass('menu-collapsed');
			let $listItem = $('.navigation li.open'),
			$subList = $listItem.children('ul');
			$listItem.addClass('nav-collapsed-open');

			$subList.show().slideUp(300, function() {
				$(this).css('display', '');
			});

			$listItem.removeClass('open');
		}
	});

	if ($(window).width() < 992) {
		$sidebar.addClass('hide-sidebar');
		$wrapper.removeClass('nav-collapsed menu-collapsed');
	}

	$(window).resize(function() {
		if ($(window).width() < 992) {
			$sidebar.addClass('hide-sidebar');
			$wrapper.removeClass('nav-collapsed menu-collapsed');
		}
		if ($(window).width() > 992) {
			$sidebar.removeClass('hide-sidebar');
			if( $('.toggle-icon').attr('data-toggle') === 'collapsed' &&  $wrapper.not('.nav-collapsed menu-collapsed')){
				$wrapper.addClass('nav-collapsed menu-collapsed');
			}
		}
	});

	$(document).on('click', '.navigation li:not(.has-sub)', function(e) {
		if( $(window).width() < 992 ) {
			$sidebar.addClass('hide-sidebar');
		}
	});

	$(document).on('click', '.logo-text', function(e) {
		if( $(window).width() < 992 ) {
			$sidebar.addClass('hide-sidebar');
		}
	});

	$(document).on('click', '.navbar-toggle', function(e) {
		e.stopPropagation();
		$sidebar.toggleClass('hide-sidebar');
	});

	$('html').on('click', function (e) {
		if ($(window).width() < 992) {
			if (!$sidebar.hasClass('hide-sidebar') && $sidebar.has(e.target).length === 0) {
				$sidebar.addClass('hide-sidebar');
			}
		}
	});

	$(document).on('click', '#sidebarClose', function(e) {
		$sidebar.addClass('hide-sidebar');
	});
}

export function collapsedMenu(isCollapsed) {
	if(isCollapsed) {
		$('.wrapper').addClass('nav-collapsed');
	} else {
		$('.wrapper').removeClass('nav-collapsed menu-collapsed');
	}
}

export function detectBody() {
	if ($(document).width() < 769) {
		$('body').addClass('body-small')
	} else {
		$('body').removeClass('body-small')
	}
}

export function smoothlyMenu() {
	if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
		$('#side-menu').hide();
		setTimeout(function () {
			$('#side-menu').fadeIn(400);
		}, 200);
	} else if ($('body').hasClass('fixed-sidebar')) {
		$('#side-menu').hide();
		setTimeout(function () {
			$('#side-menu').fadeIn(400);
		}, 100);
	} else {
		$('#side-menu').removeAttr('style');
	}
}

export function loadDepartmentMenu() {
	$('.menus_selected').each(function(event) {
		$(this).find('input:first').change(function(event) {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().parent().find('input').prop('checked', true);
			} else {
				$(this).parent().parent().parent().parent().parent().find('input').prop('checked', false);
			}
		});

		let element = $(this).parent().parent().parent().find('input').not($(this).find('input:first'));
		element.change(function() {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().find('input:first').prop('checked', true)
			} else {
				if($(this).parent().parent().parent().parent().find('input:checked').not($(this).parent().parent().parent().parent().find('input:first')).length == 0) {
					$(this).parent().parent().parent().parent().find('input:first').prop('checked', false)
				}
			}
		});
	});

	// --
	// Checked/Unchecked child permissions
	$('.child').each(function(event) {
		let element = $(this).find('input:first');
		element.change(function(event) {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().parent().parent().find('input').prop('checked', true)
				$('#'+ event.target.className).prop('checked', true);
			} else {
				$(this).parent().parent().parent().parent().parent().parent().find('input').prop('checked', false)
				if($('.'+ event.target.className+':checked').length == 0) {
					$('#'+ event.target.className).prop('checked', false);
				}
			}
		});

		// --
		// Nested child
		let elementChild = $(this).find('input').not($(this).find('input:first'));
		elementChild.change(function(event) {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().find('input:first').prop('checked', true)
			} else {
				if($(this).parent().parent().parent().parent().find('input:checked').not($(this).parent().parent().parent().parent().find('input:first')).length == 0) {
					$(this).parent().parent().parent().parent().find('input:first').prop('checked', false)
				}
			}
		});
	});

	$('.all_view').each(function(event) {
		$(this).change(function(event) {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().parent().find('.view input').prop('checked', true);
				$('.child').find('input:first').prop('checked', true)
			} else {
				$(this).parent().parent().parent().parent().parent().find('.view input').prop('checked', false);
				if($(this).parent().parent().parent().parent().parent().find('.create input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.edit input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.delete input').is(':checked')) {
					$('.child').find('input:first').prop('checked', true);
				} else {
					$('.child').find('input:first').prop('checked', false);
				}
			}
		});
	});

	$('.all_create').each(function(event) {
		$(this).change(function(event) {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().parent().find('.create input').prop('checked', true);
				$('.child').find('input:first').prop('checked', true)
			} else {
				$(this).parent().parent().parent().parent().parent().find('.create input').prop('checked', false);
				if($(this).parent().parent().parent().parent().parent().find('.view input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.edit input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.delete input').is(':checked')) {
					$('.child').find('input:first').prop('checked', true);
				} else {
					$('.child').find('input:first').prop('checked', false);
				}
			}
		});
	})

	$('.all_edit').each(function(event) {
		$(this).change(function(event) {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().parent().find('.edit input').prop('checked', true);
				$('.child').find('input:first').prop('checked', true)
			} else {
				$(this).parent().parent().parent().parent().parent().find('.edit input').prop('checked', false);
				if($(this).parent().parent().parent().parent().parent().find('.view input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.create input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.delete input').is(':checked')) {
					$('.child').find('input:first').prop('checked', true);
				} else {
					$('.child').find('input:first').prop('checked', false);
				}
			}
		});
	});

	$('.all_delete').each(function(event) {
		$(this).change(function(event) {
			if($(this).is(":checked")) {
				$(this).parent().parent().parent().parent().parent().find('.delete input').prop('checked', true);
				$('.child').find('input:first').prop('checked', true)
			} else {
				$(this).parent().parent().parent().parent().parent().find('.delete input').prop('checked', false);
				if($(this).parent().parent().parent().parent().parent().find('.view input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.edit input').is(':checked') || $(this).parent().parent().parent().parent().parent().find('.create input').is(':checked')) {
					$('.child').find('input:first').prop('checked', true);
				} else {
					$('.child').find('input:first').prop('checked', false);
				}
			}
		});
	});

}
 