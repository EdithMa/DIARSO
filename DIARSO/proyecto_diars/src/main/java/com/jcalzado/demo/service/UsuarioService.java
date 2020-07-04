package com.jcalzado.demo.service;

import java.util.List;
import java.util.Optional;

import com.jcalzado.demo.model.Usuario;

public interface UsuarioService{

	public abstract Usuario registrar(Usuario u);
	public abstract int existeUsuario(String correo);
	public abstract List<Usuario> listarusu();
	public abstract Usuario buscar(String correo);
	public abstract int validar(Usuario u);
	public abstract boolean va(String correo,String password);
	public abstract Optional<Usuario> buscarxid(int id);
	
	public Usuario findByUsername(String username);
}
