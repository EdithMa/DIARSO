package com.jcalzado.demo.service.impl;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.jcalzado.demo.dao.UsuarioDao;
import com.jcalzado.demo.model.Usuario;
import com.jcalzado.demo.service.UsuarioService;

@Service("usuarioservice")
public class UsuarioServiceImpl implements UsuarioService{

	@Autowired
	@Qualifier("usuariodao")
	private UsuarioDao usuariodao;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Override
	public int existeUsuario(String correo) {
		int res = 0;
		List<Usuario> all = usuariodao.findAll();
		for(Usuario u: all) {
			if(u.getCorreo().equals(correo))
				res = u.getIdusuario();
		}
		return res;
	}
	
	@Override
	public List<Usuario> listarusu() {
		return usuariodao.findAll();
	}
	
	@Override
	public Usuario buscar(String correo) {
		return usuariodao.findByCorreo(correo);
	}

	@Override
	public int validar(Usuario u) {
		int r=0;
		if(!u.getCorreo().equals(null) && !u.getPassword().equals(null)) {
			r=1;
		}else {
			r=0;
		}
		return r;
	}

	@Override
	public boolean va(String correo, String password) {
		
		boolean i;
		
		i=usuariodao.existsByCorreoAndPassword(correo, password);
		
		boolean res;
		if(i==true){
			res=true;
		}else {
			res=false;
		}
		return res;
	}
	
	@Override
	public Optional<Usuario> buscarxid(int id) {
		return usuariodao.findById(id);
	}

	@Override
	public Usuario findByUsername(String username) {
		// TODO Auto-generated method stub
		return usuariodao.findByUsername(username);
	}

	@Override
	public Usuario registrar(Usuario u) {
		
		String encodePassword=bCryptPasswordEncoder.encode(u.getPassword());
		u.setPassword(encodePassword);
		return usuariodao.save(u);
	}

	private boolean isLoggedUserADMIN() {
		//Obtener el usuario logeado
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		UserDetails loggedUser = null;
		Object roles = null;

		//Verificar que ese objeto traido de sesion es el usuario
		if (principal instanceof UserDetails) {
			loggedUser = (UserDetails) principal;

			roles = loggedUser.getAuthorities().stream()
					.filter(x -> "ROLE_ADMIN".equals(x.getAuthority())).findFirst()
					.orElse(null); 
		}
		return roles != null ? true : false;
	}
	
	public Usuario getLoggedUser() throws Exception {
		//Obtener el usuario logeado
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		UserDetails loggedUser = null;

		//Verificar que ese objeto traido de sesion es el usuario
		if (principal instanceof UserDetails) {
			loggedUser = (UserDetails) principal;
		}
		
		Usuario myUser = usuariodao.findByUsername(loggedUser.getUsername());
		
		return myUser;
	}
	
}
