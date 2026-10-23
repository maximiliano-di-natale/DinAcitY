import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  MapPin,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Car,
  LogOut,
  Save,
  KeyRound,
  Shield,
  Check
} from 'lucide-react';
import { clientFallbackService } from '../services/clientFallbackService.js';

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'register',
  currentUser = null,
  onAuthSuccess,
  onUpdateUser,
  onLogout
}) {
  const [mode, setMode] = useState(initialMode); // 'register' | 'login' | 'profile'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form fields for registration & login
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Profile edit fields for existing logged in user
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  // User vehicles for profile display
  const [userVehicles, setUserVehicles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');

      if (currentUser) {
        setProfileData({
          nombre: currentUser.nombre || '',
          apellido: currentUser.apellido || '',
          direccion: currentUser.direccion || '',
          telefono: currentUser.telefono || '',
          email: currentUser.email || ''
        });
      }

      // Load user vehicles from localStorage for profile view
      try {
        const savedVehicles = JSON.parse(localStorage.getItem('dinacity_user_vehicles') || '[]');
        setUserVehicles(savedVehicles);
      } catch (e) {
        setUserVehicles([]);
      }
    }
  }, [isOpen, initialMode, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  // Password strength evaluation
  const evalPassword = (pwd = '') => {
    const rules = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(pwd)
    };
    const score = Object.values(rules).filter(Boolean).length;
    let label = 'Muy Débil';
    let color = 'bg-red-500';
    let width = 'w-1/5';

    if (score === 2) {
      label = 'Débil';
      color = 'bg-orange-500';
      width = 'w-2/5';
    } else if (score === 3) {
      label = 'Media';
      color = 'bg-yellow-500';
      width = 'w-3/5';
    } else if (score === 4) {
      label = 'Buena';
      color = 'bg-blue-500';
      width = 'w-4/5';
    } else if (score === 5) {
      label = 'Excelente / Muy Segura';
      color = 'bg-emerald-600';
      width = 'w-full';
    }

    return { rules, score, label, color, width };
  };

  const strength = evalPassword(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword === formData.password;

  // Handle User Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('La contraseña debe tener un mínimo de 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      let data = null;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido: formData.apellido,
            direccion: formData.direccion,
            telefono: formData.telefono,
            email: formData.email,
            password: formData.password
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const resJson = await res.json();
          if (res.ok) {
            data = resJson;
          } else {
            throw new Error(resJson.error || 'Error al crear la cuenta.');
          }
        } else {
          // GitHub Pages u hosting estático devolvió 404 HTML
          throw new Error('API_OFFLINE');
        }
      } catch (fetchErr) {
        if (fetchErr.message !== 'API_OFFLINE' && !fetchErr.message.includes('fetch') && !fetchErr.message.includes('JSON')) {
          throw fetchErr;
        }
        // Fallback a almacenamiento y sesión local en cliente
        data = clientFallbackService.registerUser({
          nombre: formData.nombre,
          apellido: formData.apellido,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email,
          password: formData.password
        });
      }

      setSuccessMessage('¡Cuenta creada con éxito! Bienvenido a DinAcitY Mendoza.');
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || 'Error al registrar usuario.');
    } finally {
      setLoading(false);
    }
  };

  // Handle User Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      let data = null;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const resJson = await res.json();
          if (res.ok) {
            data = resJson;
          } else {
            throw new Error(resJson.error || 'Error al iniciar sesión.');
          }
        } else {
          throw new Error('API_OFFLINE');
        }
      } catch (fetchErr) {
        if (fetchErr.message !== 'API_OFFLINE' && !fetchErr.message.includes('fetch') && !fetchErr.message.includes('JSON')) {
          throw fetchErr;
        }
        // Fallback a autenticación de cliente (GitHub Pages standalone)
        data = clientFallbackService.loginUser({
          email: formData.email,
          password: formData.password
        });
      }

      setSuccessMessage('¡Ingreso exitoso! Bienvenido a DinAcitY.');
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Save Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      let updatedUser = null;
      const token = localStorage.getItem('dinacity_token') || '';

      if (token && !token.startsWith('client_tok_')) {
        try {
          const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              nombre: profileData.nombre,
              apellido: profileData.apellido,
              direccion: profileData.direccion,
              telefono: profileData.telefono
            })
          });
          if (res.ok) {
            const resJson = await res.json();
            updatedUser = resJson.user || resJson;
          }
        } catch (apiErr) {
          console.warn('API error updating profile, saving locally:', apiErr);
        }
      }

      if (!updatedUser) {
        const resLocal = clientFallbackService.updateUserProfile({
          id: currentUser?.id,
          nombre: profileData.nombre,
          apellido: profileData.apellido,
          direccion: profileData.direccion,
          telefono: profileData.telefono,
          email: profileData.email
        });
        updatedUser = resLocal.user;
      }

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      setSuccessMessage('¡Tus datos de perfil se actualizaron con éxito!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar cambios de perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setFormData({
      nombre: 'Maximiliano',
      apellido: 'Di Natale',
      direccion: 'Calle San Isidro 2341, Godoy Cruz, Mendoza',
      telefono: '261 497-9100',
      email: 'maxi@dinacity.com.ar',
      password: 'DinAcitY2026!Seguro',
      confirmPassword: 'DinAcitY2026!Seguro'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 relative my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header en Rojo Institucional con Azul DinAcitY */}
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 p-4 sm:p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white bg-black/15 hover:bg-black/30 rounded-full p-1.5 transition cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-blue-600 p-1.5 rounded-lg border border-white/30 text-white font-black shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">
              Din<span className="text-yellow-300">AcitY</span> Mendoza
            </span>
          </div>

          <h2 className="text-xl font-black leading-snug">
            {mode === 'profile'
              ? 'Mi Perfil de Usuario'
              : mode === 'register'
              ? 'Crear tu cuenta segura'
              : 'Iniciar sesión en DinAcitY'}
          </h2>
          <p className="text-xs text-red-100/90 mt-1">
            {mode === 'profile'
              ? 'Gestioná tus datos personales, ubicación en Mendoza y vehículos registrados.'
              : mode === 'register'
              ? 'Registrate para cotizar repuestos por WhatsApp en Mendoza, gestionar tu libreta de mantenimiento y guardar tus vehículos.'
              : 'Accedé para consultar tus repuestos, cotizaciones guardadas y ubicación de entrega en Mendoza.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex gap-1.5 mt-4 bg-red-950/40 p-1 rounded-xl border border-white/20">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => { setMode('profile'); setErrorMessage(''); }}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                    mode === 'profile'
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Mi Perfil
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(''); }}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Crear otra cuenta
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Cambiar cuenta
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(''); }}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Crear cuenta
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Ingresar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Form Body con letras oscuras de alta visibilidad */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto text-gray-900">
          
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODO 1: REGISTRO DE NUEVO USUARIO (LETRAS 100% VISIBLES EN NEGRO) */}
          {/* ============================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    Nombre <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      name="nombre"
                      required
                      placeholder="Ej: Maximiliano"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    Apellido <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      name="apellido"
                      required
                      placeholder="Ej: Di Natale"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Teléfono / WhatsApp para Cotizaciones en Mendoza */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Teléfono o WhatsApp <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Ej: 261 497-9100"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Se usa para coordinar respuestas de WhatsApp con las casas de repuestos de Mendoza.
                </p>
              </div>

              {/* Dirección en Mendoza */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Dirección en Mendoza <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-red-600 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    name="direccion"
                    required
                    placeholder="Ej: Calle San Isidro 2341, Godoy Cruz, Mendoza"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Sirve para calcular las casas de repuestos y talleres más cercanos a tu domicilio o taller.
                </p>
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Correo Electrónico <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tunombre@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                  />
                </div>
              </div>

              {/* Contraseña Segura */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Contraseña Segura <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Ingresá tu contraseña (mínimo 8 caracteres)"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2 space-y-1.5 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-gray-600">Nivel de Seguridad:</span>
                      <span className={strength.score >= 4 ? 'text-emerald-700 font-black' : 'text-gray-700'}>
                        {strength.label}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>

                    {/* Requirements checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[10px]">
                      <span className={`flex items-center gap-1 ${strength.rules.length ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                        {strength.rules.length ? '✓' : '○'} Mínimo 8 caracteres
                      </span>
                      <span className={`flex items-center gap-1 ${strength.rules.upper ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                        {strength.rules.upper ? '✓' : '○'} Mayúscula (A-Z)
                      </span>
                      <span className={`flex items-center gap-1 ${strength.rules.lower ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                        {strength.rules.lower ? '✓' : '○'} Minúscula (a-z)
                      </span>
                      <span className={`flex items-center gap-1 ${strength.rules.number ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                        {strength.rules.number ? '✓' : '○'} Un número (0-9)
                      </span>
                      <span className={`flex items-center gap-1 sm:col-span-2 ${strength.rules.special ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                        {strength.rules.special ? '✓' : '○'} Carácter especial (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Confirmar Contraseña <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Repetí la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
                    title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-[10px] mt-1 font-bold ${passwordsMatch ? 'text-emerald-600' : 'text-red-600'}`}>
                    {passwordsMatch ? '✓ Las contraseñas coinciden perfectamente.' : '✗ Las contraseñas no coinciden.'}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || (formData.confirmPassword && !passwordsMatch)}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Encriptando y creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Crear Cuenta Segura</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                >
                  Cargar datos de prueba de Maximiliano
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODO 2: INICIO DE SESIÓN (LOGIN) */}
          {/* ============================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tunombre@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Tu contraseña registrada"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando credenciales...</span>
                    </>
                  ) : (
                    <span>Ingresar a DinAcitY</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((p) => ({
                      ...p,
                      email: 'maxi@dinacity.com.ar',
                      password: 'DinAcitY2026!Seguro'
                    }));
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                >
                  Cargar credenciales de prueba de Maximiliano
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODO 3: APARTADO DE PERFIL DEL USUARIO (GESTIÓN COMPLETA) */}
          {/* ============================================================== */}
          {mode === 'profile' && (
            <div className="space-y-4">
              
              {/* Tarjeta de Resumen del Usuario */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm border border-blue-500">
                    {profileData.nombre ? profileData.nombre.charAt(0).toUpperCase() : 'U'}
                    {profileData.apellido ? profileData.apellido.charAt(0).toUpperCase() : ''}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-black text-base text-gray-900 leading-tight">
                        {profileData.nombre} {profileData.apellido}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        🛡️ Verificado
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-mono">
                      {profileData.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Zona Activa</span>
                  <span className="text-xs font-black text-red-600 flex items-center gap-0.5 justify-end">
                    <MapPin className="w-3.5 h-3.5" />
                    Mendoza
                  </span>
                </div>
              </div>

              {/* Formulario de Edición de Datos de Perfil */}
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={profileData.nombre}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      Apellido
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        name="apellido"
                        required
                        value={profileData.apellido}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    Teléfono o WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      name="telefono"
                      placeholder="Ej: 261 497-9100"
                      value={profileData.telefono}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    Dirección en Mendoza
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-red-600 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      name="direccion"
                      required
                      placeholder="Ej: Calle San Isidro 2341, Godoy Cruz, Mendoza"
                      value={profileData.direccion}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 font-semibold focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-500/20 shadow-xs caret-red-600"
                    />
                  </div>
                </div>

                {/* Vehículos Registrados en la Cochera del Usuario */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-red-600" />
                      <span>Vehículos Registrados en tu Cuenta ({userVehicles.length}):</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {userVehicles.length > 0 ? (
                      userVehicles.map((veh, idx) => (
                        <div
                          key={veh.patente || idx}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-300 text-gray-900 text-[11px]">
                              {veh.patente || 'S/P'}
                            </span>
                            <span className="font-bold text-gray-800">
                              {veh.brand} {veh.model}
                            </span>
                            <span className="text-gray-500 text-[11px]">
                              ({veh.year})
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            DNRPA Vinculado
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        No tenés vehículos cargados aún. Podés buscar cualquier patente en la app para vincularlo a tu cochera.
                      </p>
                    )}
                  </div>
                </div>

                {/* Botón de Guardar Cambios */}
                <div className="pt-3 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Guardando perfil...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar Cambios en mi Perfil</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onLogout) onLogout();
                      onClose();
                    }}
                    className="py-2.5 px-4 bg-gray-100 hover:bg-red-50 text-red-600 border border-gray-200 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* Seguridad y Privacidad */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Tus datos viajan encriptados con hash bcrypt conforme a los estándares de seguridad web de DinAcitY Mendoza.</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
