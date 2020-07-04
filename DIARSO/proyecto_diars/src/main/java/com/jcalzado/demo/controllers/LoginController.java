package com.jcalzado.demo.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.jcalzado.demo.model.Producto;
import com.jcalzado.demo.model.Usuario;
import com.jcalzado.demo.service.ProductoService;
import com.jcalzado.demo.service.RolService;
import com.jcalzado.demo.service.UsuarioService;

@Controller
public class LoginController {

	@Autowired
	@Qualifier("usuarioservice")
	private UsuarioService usuarioservice;
	
	@Autowired
	@Qualifier("rolservice")
	private RolService rolservice;

	@GetMapping({"/","/login"})
	public String login(Model model) {
		return "login";
	}
	
	
	@GetMapping("/registro")
	public String registroForm(Model model) {
		model.addAttribute("usuario", new Usuario());
		model.addAttribute("roles", rolservice.lsitarrol());
		return "registrarcliente"; 
	}
	
	@PostMapping("/registro")
	public String registro(@ModelAttribute Usuario usuario, BindingResult result,Model model) {
		if(result.hasErrors()) {
			return "registrarcliente";
		}else {
			model.addAttribute("usuario", usuarioservice.registrar(usuario));
		}
		return "redirect:/login";
	} 
	
	
}
