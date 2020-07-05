package com.jcalzado.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.jcalzado.demo.model.Producto;
import com.jcalzado.demo.model.Usuario;
import com.jcalzado.demo.service.CategoriaService;
import com.jcalzado.demo.service.ProductoService;

@Controller
public class InicioController {
	
	@Autowired
	@Qualifier("productoservice")
	private ProductoService productoService;

	@Autowired
	@Qualifier("categoriaservice")
	private CategoriaService categoriaservice;

	@GetMapping("/error404")
	public String noEncontrado(Model model) {
		return "error404";
	}
	@GetMapping("/")
	public String inicio(Model model) {
		List<Producto> productos = productoService.listarpro();
		model.addAttribute("producto", new Producto());
		model.addAttribute("productos", productos);
		return "catalogoa";
	}
}
