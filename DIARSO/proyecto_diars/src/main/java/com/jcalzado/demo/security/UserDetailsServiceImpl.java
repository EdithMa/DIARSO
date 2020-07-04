package com.jcalzado.demo.security;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jcalzado.demo.dao.UsuarioDao;
import com.jcalzado.demo.model.Rol;
import com.jcalzado.demo.model.Usuario;
import com.jcalzado.demo.service.UsuarioService;

@Service
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService{
	@Autowired
	private UsuarioDao usuarioDao;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Usuario appUser=usuarioDao.findByUsername(username);
		if(appUser==null) {
			new UsernameNotFoundException("Login Username Invalido.");
		}
		
		Set<GrantedAuthority> grantList = new HashSet<GrantedAuthority>();
		for (Rol rol: appUser.getRol()) {
			GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(rol.getRol());
            grantList.add(grantedAuthority);
		}
		UserDetails user = (UserDetails) new User(username,appUser.getPassword(),grantList);

		return user;
	}
	
	
}
