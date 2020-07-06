package com.jcalzado.demo.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;

import org.springframework.format.annotation.DateTimeFormat;

import com.sun.istack.NotNull;

@Entity
@Table(name="pedido")
public class Pedido implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idpedido;
	
	@Column
	private String codigo;
	
	@Column
	@NotEmpty
	private String moneda;
	
	@Column
	@NotEmpty
	@Email
	private String email;
	
	@Column
	private String observaciones;
	
	@Column
	@NotNull
	@Min(1)
	private double subtotal_precio;
	
	@Column
	@NotNull
	private double total_impuesto;
	
	@Column
	@NotNull
	@Min(1)
	private double total_precio;
	
	@Column
	@NotEmpty
	private String estado_pago;
	
	@Column
	private String fecha_cierre;
	
	@Column
	private boolean estado;
	
	@Column
	private String fecha_creacion;
	
	@OneToOne
	@JoinColumn(name="idusuario")
	private Usuario usuario;
	
	public int getIdpedido() {
		return idpedido;
	}

	public void setIdpedido(int idpedido) {
		this.idpedido = idpedido;
	}
	
	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}
	
	public String getMoneda() {
		return moneda;
	}

	public void setMoneda(String moneda) {
		this.moneda = moneda;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getObservaciones() {
		return observaciones;
	}

	public void setObservaciones(String observaciones) {
		this.observaciones = observaciones;
	}
	
	public double getSubtotal_precio() {
		return subtotal_precio;
	}

	public void setSubtotal_precio(double subtotal_precio) {
		this.subtotal_precio = subtotal_precio;
	}
	
	public double getTotal_impuesto() {
		return total_impuesto;
	}

	public void setTotal_impuesto(double total_impuesto) {
		this.total_impuesto = total_impuesto;
	}
	
	public double getTotal_precio() {
		return total_precio;
	}

	public void setTotal_precio(double total_precio) {
		this.total_precio = total_precio;
	}
	
	public String getEstado_pago() {
		return estado_pago;
	}

	public void setEstado_pago(String estado_pago) {
		this.estado_pago = estado_pago;
	}
	
	public String getFecha_cierre() {
		return fecha_cierre;
	}

	public void setFecha_cierre(String fecha_cierre) {
		this.fecha_cierre = fecha_cierre;
	}
	
	public boolean getEstado() {
		return estado;
	}

	public void setEstado(boolean estado) {
		this.estado = estado;
	}
	

	public String getFecha_creacion() {
		return fecha_creacion;
	}

	public void setFecha_creacion(String fecha_creacion) {
		this.fecha_creacion = fecha_creacion;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	
	@Override
	public String toString() {
		return "Pedido [idpedido=" + idpedido + ", codigo=" + codigo + ", moneda=" + moneda + ", email="
				+ email + ", observaciones=" + observaciones + ", subtotal_precio=" + subtotal_precio 
				+ ", total_impuesto=" + total_impuesto + ", total_precio=" + total_precio 
				+ ", estado_pago=" + estado_pago + ", fecha_cierre=" + fecha_cierre + ", estado=" + estado
				+ ", fecha_creacion=" + fecha_creacion + ", usuario ="
				+ "]";
	}
	
	private static final long serialVersionUID = 1L;
}
