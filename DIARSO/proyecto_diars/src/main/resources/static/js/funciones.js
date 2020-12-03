
function eliminar(id) {
	swal({
		  title: "¿Estas seguro de eliminar?",
		  text: "Eliminaras este producto del stock",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})
		.then((OK) => {
		  if (OK) {
			  $.ajax({
				   url:"/eliminar/"+id,
				   success: function(res){
					   console.log(res);
				   }
			  });
		    swal("Producto eliminado", {
		      icon: "success",
		    }).then((ok)=>{
		    	if(ok) {
		    		location.href="/lproducto";
		    	}
		    });
		  } else {
		    swal("No se elimino el producto");
		  }
		});
}

var diarsfy = {
	version: "1.0.1",
	moneda: "S/. ",
	bienvenido: function(){
		return "Carrito de compras v."+this.version;
	},
	objectToJson: function objectToJson(strObj){
		var tmp = strObj.replace("Producto [", "").replace("]", "");
		tmp = tmp.split(",");
		var jsonText = {};
		for(var i=0; i<tmp.length; i++){
			var part1 = tmp[i].replace(/^\s+|\s+$/g, "");
			if(part1!==""){
				var part2 = part1.split("=");
				if(part2.length===2){
					jsonText[part2[0]] = part2[1]!==""?(isNaN(part2[1])?part2[1]:parseFloat(part2[1])):"";
				}
			}
		}
		return jsonText;
	}, 
	isJSON: function isJSON(str){
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	},
	isEMAIL: function isEMAIL(str){
	  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  return re.test(str);
	},
	isDNI: function isDNI(str){
		return str.length===8;
		/*
		if (/\d{8}[a-z A-Z]/.test(str)) {
			var n = str.substr(0,8);
			var c = str.substr(8,1);
			return (c.toUpperCase() == 'TRWAGMYFPDXBNJZSQVHLCKET'.charAt(n%23)); // DNI correcto ?
		}
		return false;// DNI incorrecto
		*/
	},
	validacionesInput: function validacionesInput(type, str){
		var _this = this;
		switch(type){
			case 'email': 
				return _this.isEMAIL(str);
				break;
			case 'dni':
				return _this.isDNI(str);
				break;
			case 'text':
				return str!=="";
				break;
		}
		return true;
	},
	formatoMoneda: function formatoMoneda(amount, decimals=2){
		var _this = this;
	    amount += ''; // por si pasan un numero en vez de un string
	    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

	    decimals = decimals || 0; // por si la variable no fue fue pasada

	    // si no es un numero o es igual a cero retorno el mismo cero
	    if (isNaN(amount) || amount === 0) 
	        return parseFloat(0).toFixed(decimals);

	    // si es mayor o menor que cero retorno el valor formateado como numero
	    amount = '' + amount.toFixed(decimals);

	    var amount_parts = amount.split('.'),
	        regexp = /(\d+)(\d{3})/;

	    while (regexp.test(amount_parts[0]))
	        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

	    return _this.moneda+amount_parts.join('.');
	},
	renderMiniCart: function renderMiniCart(){
		var _this = this;
		if($('.mini-cart-icon').length){
			var totalItems = 0;
			var carritojs = $.cookie('carritojs');
			if(typeof(carritojs)!=="undefined" && _this.isJSON(carritojs)){
				var carrito = JSON.parse(carritojs);
				totalItems = carrito.items.length;//items en base a las líneas
				/*//items en base a la cantidad total
				for(var i=0; i<carrito.items.length; i++){
					totalItems += carrito.items[i].cantidad;
				}
				*/
			}
			$('.mini-cart-icon').find('label').html(totalItems>0?('('+totalItems+')'):'');
		}
	}, 
	renderCarrito: function renderCarrito(){
		var _this = this;
		if($('.container-carrito-js').length){
			var totalItems = 0;
			var totalPrice = 0;
			var carritojs = $.cookie('carritojs');
			var _table = '';
			if(typeof(carritojs)!=="undefined" && _this.isJSON(carritojs)){
				var carrito = JSON.parse(carritojs);
				totalPrice = carrito.total;
				totalItems = carrito.items.length;//items en base a las líneas
				for(var i=0; i<carrito.items.length; i++){
					var row = carrito.items[i];
					//totalItems += row.cantidad;//items en base a la cantidad
					
					_table += '<tr>';
						_table += '<td scope="row">'+(i+1)+'</th>';
						_table += '<td class="picture-cart"><img src="uploads/'+row.foto+'" alt="'+row.nombre+'" /></td>';
						_table += '<td class="description-cart">'+row.nombre+' <small>'+row.descripcion+'</small></td>';
						_table += '<td class="cant-controller"><a class="minus" href=""><span>-</span></a><span class="quantity-cart" th:data-product="${producto}">'+row.cantidad+'</span><a class="plus" href=""><span>+</span></a></td>';
						//_table += '<td class="quantity-cart">'+row.cantidad+'</td>';
						_table += '<td class="money-cart">'+_this.formatoMoneda(row.subtotal)+'</td>';
						_table += '<td class="remove-cart"><a href="javascript:void(0);" class="delete-item-cart" data-id="'+row.id+'"><svg class="svg-inline--fa fa-trash fa-w-14" aria-hidden="true" data-prefix="fa" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm415.2 56.7L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32.8 140.7c-.4-6.9 5.1-12.7 12-12.7h358.5c6.8 0 12.3 5.8 11.9 12.7z"></path></svg></a></td>';
					_table += '</tr>';
				}
			}
			$('.carrito-items-all').html(totalItems>0?('Tienes '+totalItems+' items'):'Tu carrito está vacío');
			$('.carrito-items-table tbody').html(_table!==''?_table:'<tr><td colspan="6"></td></tr>');
			$('.subtotal-cart').html(_this.formatoMoneda(totalPrice));
			if(totalItems>0){
				$('#vaciarCarrito').removeAttr("disabled");
				$('#irAlCheckout').removeAttr("disabled");
			}
			else{
				$('#vaciarCarrito').attr("disabled", "disabled");
				$('#irAlCheckout').attr("disabled", "disabled");
			}
		}
	},
	renderCheckout: function renderCheckout(){
		var _this = this;
		if($('#table_items').length){
			var carritojs = $.cookie('carritojs');
			var _table = '', _summary = '';
			if(typeof(carritojs)!=="undefined" && _this.isJSON(carritojs)){
				var _idproducto='', _cantidad='', _precio='', _subtotal_item='', _nombre_producto='', _descripcion='', _foto='';
				
				var carrito = JSON.parse(carritojs);
				for(var i=0; i<carrito.items.length; i++){
					var row = carrito.items[i];
					
					_idproducto += (_idproducto!==''?';':'')+row.id;
					_cantidad += (_cantidad!==''?';':'')+row.cantidad;
					_precio += (_precio!==''?';':'')+row.precio;
					_subtotal_item += (_subtotal_item!==''?';':'')+row.subtotal;
					_nombre_producto += (_nombre_producto!==''?';':'')+row.nombre;
					_descripcion += (_descripcion!==''?';':'')+row.descripcion;
					_foto += (_foto!==''?';':'')+row.foto;
					
					_table += '<div class="tr-row">';
						_table += '<div class="tr-thumbnail">';
							_table += '<div class="thumbnail">';
								_table += '<img src="uploads/'+row.foto+'" alt="'+row.nombre+'" />';
								_table += '<span class="quantity">'+row.cantidad+'</span>';
							_table += '</div>';
						_table += '</div>';
						_table += '<div class="tr-description">';
							_table += '<div class="emphasis">'+row.nombre+'</div>';
							_table += '<div class="small">'+row.descripcion+'</div>';
						_table += '</div>';
						_table += '<div class="tr-price">';
							_table += '<div class="money">'+_this.formatoMoneda(row.subtotal)+'</div>';
						_table += '</div>';
					_table += '</div>';
				}
				_summary += '<div class="subtotal"><span>Subtotal</span><span class="money">'+_this.formatoMoneda(carrito.total)+'</span></div>';
				_summary += '<div class="impuestos"><span>Impuestos</span><span class="money">'+_this.formatoMoneda(0)+'</span></div>';
				_summary += '<div class="total"><span>Total</span><span class="money">'+_this.formatoMoneda(carrito.total)+'</span></div>';
				
				$('#subtotal_precio').val(carrito.total);
				$('#total_impuesto').val(0);
				$('#total_precio').val(carrito.total);
				$('#monto').val(carrito.total);
				$('#lidproducto').val(_idproducto);
				$('#lcantidad').val(_cantidad);
				$('#lprecio').val(_precio);
				$('#lsubtotal_item').val(_subtotal_item);
				$('#lnombre').val(_nombre_producto);
				$('#ldescripcion').val(_descripcion);
				$('#lfoto').val(_foto);

				$('#table_items').html(_table!==''?_table:'');
				$('#table_summary').html(_summary!==''?_summary:'');
				$('.checkout-loading').remove();
			}else{
				$('.checkout-loading').append('<div class="checkout-overlay">No tiene artículos en su carrito</div>');
				setTimeout(function(){
					top.location.href = "/catalogo";
				}, 2500);
			}
		}
	},
	renderThankyou: function renderThankyou(){
		var _this = this;
		if($('.template-thankyou').length){
			if($('.money').length){
				$('.money').each(function(){
					var _el = $(this);
					var _text = _el.text();
					_el.attr("data-money", _text);
					_el.html(_this.formatoMoneda(_text));
				});
			}
			$('.checkout-loading').remove();
		}
	},
	vaciarCarrito: function vaciarCarrito(){
		$.cookie('carritojs', undefined, { expires: 0.5 });
	}, 
	actualizarStock: function actualizarStock(){
	
	},
	removerDelCarrito: function removerDelCarrito(_id, _callback){
		var _this = this;
		var _total = 0;
		var respuestaJS = { processOk: true, carritojs: null, mensaje: "" };
		var carritojs = $.cookie('carritojs');
		if(typeof(carritojs)!=="undefined" && _this.isJSON(carritojs)){
			var carrito = JSON.parse(carritojs);
			for(var i=0; i<carrito.items.length; i++){
				if(carrito.items[i].id === parseInt(_id)){
					carrito.items.splice(i, 1);
				}
			}//endfor
			for(var j=0; j<carrito.items.length; j++){
				_total += carrito.items[j].subtotal;
			}//endfor
			setTimeout(function(){
				carrito.total = _total;
				$.cookie('carritojs', JSON.stringify(carrito), { expires: 0.5 })
				
				respuestaJS.carritojs = carrito;
				_this.renderMiniCart();
				_this.renderCarrito();
				
				if(typeof(_callback)==="function")
					_callback(respuestaJS);
			}, 1500);
			
			return false;
		}
		
		respuestaJS.mensaje = "El carrito está vacío";
		if(typeof(_callback)==="function")
			_callback(respuestaJS);
	},
	agregarAlCarrito: function agregarAlCarrito(objAdd, objProd, _callback){
		var _this = this;
		var respuestaJS = { processOk: false, carritojs: null, mensaje: "" };
		var validacionesOk = true;
		
		//validaciones
		if(!objAdd.id || !objAdd.cantidad){
			respuestaJS.mensaje = "Los campos id y cantidad son obligatorios en el objeto 'Agregar'";
			validacionesOk = false;
		}
		if(!objProd.idproducto){
			respuestaJS.mensaje = "Los campos del producto enviado no cumplen con el formato requerido";
			validacionesOk = false;
		}
		if(objAdd.id !== objProd.idproducto){
			respuestaJS.mensaje = "Los ids enviados no coinciden";
			validacionesOk = false;
		}
		if(!validacionesOk){
			setTimeout(function(){
				if(typeof(_callback)==="function"){
					_callback(respuestaJS);
				}else{
					console.error(respuestaJS.mensaje);
				}
			}, 1500);
			return false;
		}
		
		//proceso
		var carrito = {};
		var carritojs = $.cookie('carritojs');
		if(typeof(carritojs)!=="undefined" && _this.isJSON(carritojs)){
			carrito = JSON.parse(carritojs);
		}else{
			carrito = {
				usuario: {},
				items: [], 
				total: 0
			};
		}
		var _procesarLuego = true;
		var _total = 0;
		for(var i=0; i<carrito.items.length; i++){
			if(carrito.items[i].id === objAdd.id){
				_procesarLuego = false;
				var curr = carrito.items[i];
				var _cantidad = curr.cantidad+objAdd.cantidad;
				var _subtotal = _cantidad * curr.precio;
				carrito.items[i].cantidad = _cantidad;
				carrito.items[i].subtotal = _subtotal;
			}
			_total += carrito.items[i].subtotal;
		}
		if(_procesarLuego){
			_total += (objProd.precio*objAdd.cantidad);
			var newAdd = {
				id: objProd.idproducto,// id de producto
				cantidad: objAdd.cantidad, // cantidad numérica
				precio: objProd.precio,//  precio a aplicar
				subtotal: (objAdd.cantidad*objProd.precio),
				nombre: objProd.nombre, 
				stock: objProd.cantidad, 
				descripcion: objProd.descripcion, 
				estado: objProd.estado, 
				foto: objProd.foto, 
				categorias: objProd.categorias
			};
			carrito.items.push(newAdd);
		}
		carrito.total = _total;
		
		setTimeout(function(){
			$.cookie('carritojs', JSON.stringify(carrito), { expires: 0.5 })
			
			respuestaJS.processOk = true;
			respuestaJS.carritojs = carrito;
			_this.renderMiniCart();
			
			if(typeof(_callback)==="function")
				_callback(respuestaJS);
		}, 1500);
	}, 
	procesarFormulario1: function procesarFormulario1(_callback){
		var _this = this;
		var respuestaJS = { processOk: false, mensaje: "", dataText: "", errores: [] };
		var validacionesOk = true;
		var email = $('#email');
		var nombre = $('#nombre');
		var apellidos = $('#apellidos');
		var direccion1 = $('#direccion1');
		var direccion2 = $('#direccion2');
		var recibe_pedido = $('#recibe_pedido');
		
		//validaciones
		if(recibe_pedido.val()===''){
			recibe_pedido.val(nombre.val()+(apellidos.val()!==""?(" "+apellidos.val()):""));
		}
		
		//proceso
		$('.error').remove();
		$.ajax({
			url: "/checkout/customer",
			type: "POST", 
			data: $("#formCheckout1").serialize(),
			success: function(res){
				if(res.status==="200"){
					$('#idpedido').val(res.data.idpedido);
					$('#codigopedido').val(res.data.codigoPedido);
					$('.form-label--email').html(email.val());
					$('.form-label--address-summary-1').html(direccion1.val()+(direccion2.val()!==""?(', '+direccion2.val()):''));
					$('.form-label--address-summary-2').html(' - '+recibe_pedido.val());
					
					setTimeout(function(){
						$('#formTab1').removeClass('form-tab-active');
						$('#formTab2').addClass('form-tab-active');
						$('.steps .step-1').removeClass('active');
						$('.steps .step-2').addClass('active');
						respuestaJS.processOk = true;
						respuestaJS.mensaje = res.message;
						respuestaJS.dataText = res.data;
						if(typeof(_callback)==="function")
							_callback(respuestaJS);
					}, 1500);
				}else{
					respuestaJS.processOk = false;
					respuestaJS.mensaje = res.message;
					respuestaJS.errores = res.data;
					if(typeof(_callback)==="function")
						_callback(respuestaJS);
				}
			}, 
			error: function(res){
				var errors = res.responseJSON.errors;
				setTimeout(function(){
					if(errors.length){
						errors.map(function(v){
							if(document.getElementById(v.field))
								$('#'+v.field).after('<small class="error"><strong><mayus>'+v.field.substring(0,1)+'</mayus>'+v.field.substring(1,v.field.length)+'</strong> '+v.defaultMessage+'</small>');
						});
						respuestaJS.processOk = false;
						respuestaJS.mensaje = "Uno o más errores en el resultado";
						respuestaJS.errores = errors;
						if(typeof(_callback)==="function")
							_callback(respuestaJS);
					}else{
						$('body').html('<div class="checkout-loading"><div class="checkout-overlay">Ha ocurrido un error desconocido. Cierre su sesión actual y vuelva a intentar luego</div></div>');
						setTimeout(function(){
							top.location.href = "/catalogo";
						}, 3500);
					}
				}, 1500);
			}
		});
	}, 
	procesarFormulario2: function procesarFormulario2(_callback){
		var _this = this;
		var respuestaJS = { processOk: false, mensaje: "", dataText: "", errores: [] };
		var validacionesOk = true;
		var metodo_pago = $('input[name="metodo"]');

		$.ajax({
			url: "/checkout/payments",
			type: "POST", 
			data: $("#formCheckout2").serialize(),
			success: function(res){
				if(res.status==="200"){
					
					setTimeout(function(){
						
						respuestaJS.processOk = true;
						respuestaJS.mensaje = res.message;
						respuestaJS.dataText = res.data;
						if(typeof(_callback)==="function")
							_callback(respuestaJS);
					}, 1500);
				}else{
					respuestaJS.processOk = false;
					respuestaJS.mensaje = res.message;
					respuestaJS.errores = res.data;
					if(typeof(_callback)==="function")
						_callback(respuestaJS);
				}
			}, 
			error: function(res){
				var errors = res.responseJSON.errors;
				setTimeout(function(){
					if(errors.length){
						errors.map(function(v){
							if(document.getElementById(v.field))
								$('#'+v.field).after('<small class="error"><strong><mayus>'+v.field.substring(0,1)+'</mayus>'+v.field.substring(1,v.field.length)+'</strong> '+v.defaultMessage+'</small>');
						});
						respuestaJS.processOk = false;
						respuestaJS.mensaje = "Uno o más errores en el resultado";
						respuestaJS.errores = errors;
						if(typeof(_callback)==="function")
							_callback(respuestaJS);
					}else{
						$('body').html('<div class="checkout-loading"><div class="checkout-overlay">Ha ocurrido un error desconocido. Cierre su sesión actual y vuelva a intentar luego</div></div>');
						setTimeout(function(){
							top.location.href = "/catalogo";
						}, 3500);
					}
				}, 1500);
			}
		});
	}
};

$(document).on('click', '.add-to-cart', function(e){
	e.preventDefault();
	var button = $(this);
	var producto = diarsfy.objectToJson(button.attr("data-product"));
	var cantidad = 1;
	var agregar = {
		id: producto.idproducto,// id de producto
		cantidad: cantidad // cantidad numérica
	};
	button.attr("disabled", "disabled");
	button.html("Agregando...");
	diarsfy.agregarAlCarrito(agregar, producto, function(res){
		//callback
		console.log(res);
		button.removeAttr("disabled");
		button.html("Agregar a carrito");
	});
});
$(document).on('click', '.delete-item-cart', function(e){
	e.preventDefault();
	var button = $(this);
	button.attr("disabled", "disabled");
	if(confirm("¿Deseas retirar este producto de tu carrito?")){
		var id = button.attr("data-id");
		diarsfy.removerDelCarrito(id, function(res){
			//callback
			console.log(res);
			button.removeAttr("disabled");
		});
	}
});
$(document).on('click', '#vaciarCarrito', function(e){
	e.preventDefault();
	var button = $(this);
	if(confirm("¿Deseas remover todos los productos de tu carrito?")){
		button.attr("disabled", "disabled");
		button.html('Limpiando...');
		diarsfy.vaciarCarrito();
		setTimeout(function(){
			location.reload();
		}, 1500);
	}
});
$(document).on('click', '#irAlCheckout', function(e){
	e.preventDefault();
	var button = $(this);
	button.attr("disabled", "disabled");
	button.html('Redirigiendo...');
	setTimeout(function(){
		top.location.href = "/checkout";
	}, 1500);
});
$(document).on('keyup', '[required="required"]', function(e){
	var _this = $(this);
	var _typeValid = "text";
	if(_this.attr('data-valid'))
		_typeValid = _this.attr('data-valid');

	if(!diarsfy.validacionesInput(_typeValid, _this.val())){
		_this.addClass('input-error');
		_this.removeClass('input-success');
	}else{
		_this.removeClass('input-error');
		_this.addClass('input-success');
	}

	if($('.input-success').length === $('[required="required"]').length)
		$('#btnSubmitCheckout').removeAttr('disabled');
	else
		$('#btnSubmitCheckout').attr('disabled', 'disabled');
});
$(document).on('click', '#btnSubmitCheckout', function(e){
	e.preventDefault();
	var button = $(this);
	button.attr("disabled", "disabled");
	button.html('Procesando...');
	
	var step = button.attr("data-step");
	switch(step){
		case "1": 
			diarsfy.procesarFormulario1(function(res){
				console.log(res);
				button.html('Procesar pago');
				button.attr('data-step', '2');
			});
			break;
		case "2": 
			diarsfy.procesarFormulario2(function(res){
				console.log(res);
				diarsfy.vaciarCarrito();
				top.location.href = "/thankyou/"+$('#codigopedido').val();
			});
			break;
	}
});
$(document).on('click', '.return-to-cart,.return-to-step', function(e){
	e.preventDefault();
	var step = $('#btnSubmitCheckout').attr('data-step');
	switch(step){
		case "1": 
			top.location.href = "/carrito";
			break;
		case "2": 
			$('#formTab1').addClass('form-tab-active');
			$('#formTab2').removeClass('form-tab-active');
			$('.steps .step-1').addClass('active');
			$('.steps .step-2').removeClass('active');
			$('#btnSubmitCheckout').attr('data-step', '1');
			break;
	}
});
$(document).on('change', 'input[name="metodo"]', function(e){
	e.preventDefault();
	var radioId = $(this).attr('id');
	$('#'+(radioId.replace('metodo_', 'moneda_'))).trigger('click');
	$('#btnSubmitCheckout').removeAttr('disabled');
});
$(document).on('click', '.plus', function(e){
	e.preventDefault();
	var span = $(this);
	var carritojs = $.cookie('carritojs');
	if(typeof(carritojs)!=="undefined" && _this.isJSON(carritojs)){
		carrito = JSON.parse(carritojs);
	}else{
		carrito = {
			usuario: {},
			items: [], 
			total: 0
		};
	}
	//var cantidad = 1;
	//var agregar = {
		//id: producto.idproducto,// id de producto
		//cantidad: cantidad // cantidad numérica
	//};
	//button.attr("disabled", "disabled");
	//button.html("Agregando...");
	//diarsfy.agregarAlCarrito(agregar, producto, function(res){
		//callback
		//console.log(res);
		//button.removeAttr("disabled");
		//cantidad+=cantidad;
		//button.html("Agregar a carrito");
	console.log(carritojs);
	//});
});
$(document).ready(function(){
	console.log(diarsfy.bienvenido());
	diarsfy.renderMiniCart();
	diarsfy.renderCarrito();
	diarsfy.renderCheckout();
	diarsfy.renderThankyou();
});
