package com.jcalzado.demo.controllers;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.jcalzado.demo.model.Pedido;
import com.jcalzado.demo.model.Pedidoenvios;
import com.jcalzado.demo.model.Pedidoitems;
import com.jcalzado.demo.model.Pedidoitemslist;
import com.jcalzado.demo.model.Pedidopagos;
import com.jcalzado.demo.model.Producto;
import com.jcalzado.demo.model.Rol;
import com.jcalzado.demo.model.Usuario;
import com.jcalzado.demo.service.PedidoService;
import com.jcalzado.demo.service.PedidoenvioService;
import com.jcalzado.demo.service.PedidoitemService;
import com.jcalzado.demo.service.PedidopagoService;
import com.jcalzado.demo.service.ProductoService;
import com.jcalzado.demo.service.RolService;
import com.jcalzado.demo.service.UsuarioService;
import com.jcalzado.demo.transaction.ResponseJSON;
import com.jcalzado.demo.util.Constants;
import com.jcalzado.demo.util.Functions;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
@RequestMapping(path = { "/checkout" }, produces = "application/json; charset=UTF-8")
public class CheckoutController {
	
	@Autowired
	@Qualifier("rolservice")
	private RolService rolServ;
	
	@Autowired
	@Qualifier("usuarioservice")
	private UsuarioService usuarioServ;
	
	@Autowired
	@Qualifier("pedidoservice")
	private PedidoService pedidoServ;
	
	@Autowired
	@Qualifier("pedidoenvioservice")
	private PedidoenvioService penvServ;
	
	@Autowired
	@Qualifier("pedidoitemservice")
	private PedidoitemService pitmServ;
	
	@Autowired
	@Qualifier("pedidopagoservice")
	private PedidopagoService pagoServ;
	
	@Autowired
	@Qualifier("productoservice")
	private ProductoService prodServ;
	
	@PostMapping(value="/customer", produces="application/json; charset=UTF-8", consumes=MediaType.ALL_VALUE)
	public ResponseJSON checkout_customer(@Valid Usuario u, @Valid Pedido p, @Valid Pedidoenvios e, Pedidoitemslist i, BindingResult result, RedirectAttributes flash, Model model) {
		ResponseJSON res = null;
		
		if (result.hasErrors()) {
			res = new ResponseJSON(Constants.codigoERROR, new Date().toString(), "Error", result.getAllErrors());
		} else {
			try {
				Map<String, String> objIds = new HashMap<>();
				
				//OBJETO::USUARIO
				Usuario setUsu = null;
				int idUsu = u.getIdusuario();
				if(idUsu == 0) {
					//verificar si existe el email enviado
					idUsu = usuarioServ.existeUsuario(p.getEmail());
					if(idUsu == 0) {
						//no existe: insertar nuevo usuario
						String[] part = p.getEmail().split("@");
						Optional<Rol> rol = rolServ.mostrar(Constants.rol_cliente);
						u.setCorreo(p.getEmail());
						u.setPassword(Functions.encodingPassword(part[0]));
						u.setDireccion(e.getDireccion1());
						//u.setRol();
						Serializable nusu = usuarioServ.registrar(u);
						if(nusu != null) {
							idUsu = u.getIdusuario();
							setUsu = u;
						}
					}else {
						//existe: usar el usuario actual
						Optional<Usuario> usu = usuarioServ.buscarxid(idUsu);
						setUsu = usu.get();
					}
				}else {
					Optional<Usuario> usu = usuarioServ.buscarxid(idUsu);
					setUsu = usu.get();
				}
				
				String codigoPedido = Functions.currentDate();
				objIds.put("idusuario", String.valueOf(setUsu.getIdusuario()));
				//OBJETO::PEDIDO
				p.setCodigo(codigoPedido);
				p.setUsuario(setUsu);
				p.setEstado(true);
				p.setFecha_creacion("06-07-20");
				Serializable nped = pedidoServ.guardar(p);
				if(nped != null) {
					
					objIds.put("idpedido", String.valueOf(p.getIdpedido()));
					objIds.put("codigoPedido", codigoPedido);
					//OBJETO::PEDIDO ENVIOS
					e.setPedido(p);
					e.setEstado(true);
					Serializable npen = penvServ.guardar(e);
					if(npen != null)
						objIds.put("idpedidoenvio", String.valueOf(e.getIdpedidoenvio()));
					
					String idPedidoitemsText = "[";
					//OBJETO::PEDIDO ITEMS
					String[] arrIdPr = i.getLidproducto().split(";");
					String[] arrCant = i.getLcantidad().split(";");
					String[] arrPrec = i.getLprecio().split(";");
					String[] arrSubt = i.getLsubtotal_item().split(";");
					String[] arrNomb = i.getLnombre().split(";");
					String[] arrDesc = i.getLdescripcion().split(";");
					String[] arrFoto = i.getLfoto().split(";");
					for(int itm=0; itm<arrIdPr.length; itm++) {
						Optional<Producto> prod = prodServ.listarId(Integer.parseInt(arrIdPr[itm]));
						Pedidoitems pi = new Pedidoitems();
						pi.setCantidad(Integer.parseInt(arrCant[itm]));
						pi.setPrecio(Double.parseDouble(arrPrec[itm]));
						pi.setSubtotal_item(Double.parseDouble(arrSubt[itm]));
						pi.setNombre(arrNomb[itm]);
						pi.setDescripcion(arrDesc[itm]);
						pi.setFoto(arrFoto[itm]);
						pi.setEstado(true);
						pi.setPedido(p);
						pi.setProducto(prod.get());
						Serializable npit = pitmServ.guardar(pi);
						if(npit != null)
							idPedidoitemsText += (idPedidoitemsText!="["?",":"")+(String.valueOf(pi.getIdpedidoitem()));
					}
					objIds.put("idpedidoitems", (idPedidoitemsText+"]"));
				}
				res = new ResponseJSON(Constants.codigoOK, new Date().toString(), "Ok", objIds);
			}catch(Exception ex) {
				res = new ResponseJSON(Constants.codigoERROR, new Date().toString(), ex.getMessage(), "");
			}
		}
		return res;
	}
	
	@PostMapping(value="/payments", produces="application/json; charset=UTF-8", consumes=MediaType.ALL_VALUE)
	public ResponseJSON checkout_payments(Pedido pe, @Valid Pedidopagos pa, BindingResult result, RedirectAttributes flash, Model model) {
		ResponseJSON res = null;
		
		if (result.hasErrors()) {
			res = new ResponseJSON(Constants.codigoERROR, new Date().toString(), "Error", result.getAllErrors());
		} else {
			try {
				Map<String, String> objIds = new HashMap<>();
				
				//OBJETO::PEDIDO
				Pedido setPed = null;
				int idPedido = pe.getIdpedido();
				if(idPedido != 0) {
					Optional<Pedido> ped = pedidoServ.mostrar(idPedido);
					setPed = ped.get();
					pa.setEstado(true);
					pa.setPedido(setPed);
					Serializable npag = pagoServ.guardar(pa);
					if(npag != null) {
						objIds.put("idpedidopago", String.valueOf(pa.getIdpedidopago()));
					}
				}
				res = new ResponseJSON(Constants.codigoOK, new Date().toString(), "Ok", objIds);
			}catch(Exception ex) {
				res = new ResponseJSON(Constants.codigoERROR, new Date().toString(), ex.getMessage(), "");
			}
		}
		return res;
	}
}
