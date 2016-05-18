/* Jquery.Repeter by Eli J.Chavez S. */
/* Project Page:https://elib0.github.io/jquery.repeter/ */
(function ( $ ) {
	$.fn.repeter = function(options) {
		var $this = this,
			elementOptions = {
            	class: 'element',
            	mirrorIn:null,
            	insertIn: null
            };

        // Opciones por defecto.
		var opt = $.extend({
	            addBtnClass:'.add',
	            remBtnClass:'.remove',
	            tplClass: '.template',
	            formValidation: false,
	            formSelector: 'form',
	            elements: elementOptions
	        }, options );
		var elementClass = opt.elements.class || elementOptions.class;
	   	$this.on('click', opt.addBtnClass, function(){
	   		var $root = $(this).closest( '.'+$this.attr('class') );
	   		add($root);
	    }).on('click', '.'+(elementClass)+' '+opt.remBtnClass, function(){
	    	var $root = $(this).closest( '.'+$this.attr('class') );
	    	remove(this,$root);
	    });

	    var add = function($root){
	    	var template = $($root).find(opt.tplClass)[0],
	    		numElement = $($root).find('.'+elementClass).length,
	    		$new=template.nodeName=='SCRIPT'?$(template).tmpl({'numElement':numElement}):$(template).clone().removeClass(opt.tplClass);

	    	$new.addClass(elementClass+' r-ele-'+numElement).data('r-ele', numElement); //Agregamos clase de elemento

	    	//Inserta template de acuerdo a opciones
	    	var clone = null,
	    		insertIn = opt.elements.insertIn || opt.elements.mirrorIn;

	    	if (insertIn) {
	    		if (opt.elements.mirrorIn){
	    			var $clone = $new.clone().removeClass(elementClass);	//Clonamos elemento ya insertado
	    			$clone.find('.remove')[0].remove();						//Quitamos boton de elminar si es espejo
	    		}
	    		$(insertIn).append($clone || $new);	//Insertamos elemento
	    	}
	    	if (!opt.elements.insertIn || opt.elements.mirrorIn) $new.insertBefore(template);

	    	// Si usa "Bootstrap Validator" http://1000hz.github.io/bootstrap-validator/
	    	if (opt.formValidation) {
	    		var $form = $($root).closest(opt.formSelector);
	    		$new.find('[disabled]').prop('disabled',false);
	    		if($.fn.validator&&$form.data('bs.validator')) $form.validator('reloadFields');
	    		if($.fn.formValidation&&$form.data('formValidation')){
	    			$new.find('input,textarea,select').filter(':visible').each(function(){
	    				$form.formValidation('addField',this.name);
	    			});
	    		}
	    	}
	    	//Respuesta al agregar elemento
	    	return {parent:$root,addedElement:$new,removedElement:null};
	    }

	    var remove = function(ele,$root){
	    	ele = ( (typeof ele) == 'number' )?$('button.remove','r-ele-'+ele): ele;
	    	$(ele,$root).closest('.element').fadeOut(250,function(){
	    		var rEleNum = $(ele,$root).data('r-ele'),
	    			numElements = $this.find('.'+elementClass).length;

	    		//Foco en penultimo elemento de formulario
				if (opt.formValidation) $(ele,$root).prev().find('select,input,textarea,button').last().focus();

				$('.r-ele-'+rEleNum, $this).remove();	//Elimina Clones
				$(ele,$root).remove();						//Elimina elemento

				//Enumera elementos adyacentes nuevamente
				for (var i = rEleNum+1; i <= numElements; i++) {
					$('.r-ele-'+i, $this).data('r-ele', i-1).removeClass('r-ele-'+i).addClass('r-ele-'+(i-1));
				}
				//Respuesta al borrar elemento
		   		return {parent: $this,addedElement:null,removedElement:$(ele,$root)};
			});
	    }

	    return $this;
	};
}( jQuery ));