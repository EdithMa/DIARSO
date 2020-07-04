package com.jcalzado.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class InicioController {

	@GetMapping("/error404")
	public String noEncontrado(Model model) {
		return "error404";
	}
	@GetMapping("/")
	public String inicio() {
		return "inicio";
	}
}
