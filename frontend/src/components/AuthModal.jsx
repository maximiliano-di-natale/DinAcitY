import React, { useState } from 'react';
import { X, Lock, Mail, User, MapPin, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function AuthModal({ isOpen, onClose, initialMode = 'register', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'register' | 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  // Password strength evaluation
  const evalPassword = (pwd) => {
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (strength.score < 5) {
      setErrorMessage('Por tu seguridad, la contraseña debe cumplir todos los requisitos de seguridad.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          direccion: formData.direccion,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al crear la cuenta.');
      }

      setSuccessMessage('¡Cuenta creada con éxito! Bienvenido a DinAcitY Mendoza.');
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión.');
      }

      setSuccessMessage('¡Ingreso exitoso!');
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 800);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setFormData({
      nombre: 'Maximiliano',
      apellido: 'Di Natale',
      direccion: 'Calle San Isidro 2341, Godoy Cruz, Mendoza',
      email: 'maxi@dinacity.com.ar',
      password: 'DinAcitY2026!Seguro',
      confirmPassword: 'DinAcitY2026!Seguro'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 relative my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header con estilo Mercado Libre en Rojo y Azul */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/25 rounded-full p-1.5 transition"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-600 p-1.5 rounded-lg border border-white/30 text-white font-black">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">
              Din<span className="text-yellow-300">AcitY</span> Mendoza
            </span>
          </div>

          <h2 className="text-xl font-black">
            {mode === 'register' ? 'Crear tu cuenta segura' : 'Iniciar sesión en DinAcitY'}
          </h2>
          <p className="text-xs text-red-100 mt-0.5">
            {mode === 'register'
              ? 'Registrate para comparar precios de repuestos, guardar favoritos y recibir alertas en Mendoza.'
              : 'Accedé para consultar tus repuestos, cotizaciones y ubicación en Mendoza.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 mt-4 bg-red-800/60 p-1 rounded-lg border border-red-500/40">
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-black rounded-md transition ${
                mode === 'register'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-black rounded-md transition ${
                mode === 'login'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Ingresar
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="nombre"
                      required
                      placeholder="Ej: Maximiliano"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="apellido"
                      required
                      placeholder="Ej: Di Natale"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección en Mendoza */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Dirección en Mendoza <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="direccion"
                    required
                    placeholder="Ej: Calle San Isidro 2341, Godoy Cruz, Mendoza"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Se usará para calcular costos de envío y casas de repuestos más cercanas a tu taller o domicilio.
                </p>
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tunombre@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Contraseña Segura */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contraseña Segura <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Ingresa una contraseña robusta"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2 space-y-1.5 p-2.5 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-gray-600">Nivel de Seguridad:</span>
                      <span className={strength.score === 5 ? 'text-emerald-600 font-black' : 'text-gray-700'}>
                        {strength.label}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>

                    {/* Requirements checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[10px]">
                      <span className={`flex items-center gap-1 ${strength.rules.length ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        {strength.rules.length ? '✓' : '○'} Mínimo 8 caracteres
                      </span>
                      <span className={`flex items-center gap-1 ${strength.rules.upper ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        {strength.rules.upper ? '✓' : '○'} Letra Mayúscula (A-Z)
                      </span>
                      <span className={`flex items-center gap-1 ${strength.rules.lower ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        {strength.rules.lower ? '✓' : '○'} Letra Minúscula (a-z)
                      </span>
                      <span className={`flex items-center gap-1 ${strength.rules.number ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        {strength.rules.number ? '✓' : '○'} Al menos un número (0-9)
                      </span>
                      <span className={`flex items-center gap-1 sm:col-span-2 ${strength.rules.special ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        {strength.rules.special ? '✓' : '○'} Carácter especial (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                {formData.confirmPassword && (
                  <p className={`text-[10px] mt-1 font-bold ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                    {passwordsMatch ? '✓ Las contraseñas coinciden perfectamente.' : '✗ Las contraseñas no coinciden.'}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !passwordsMatch || strength.score < 5}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-md shadow-md transition flex items-center justify-center gap-2"
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
                  className="text-[11px] text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Rellenar datos de prueba para Maximiliano
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tunombre@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Tu contraseña registrada"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-sm rounded-md shadow-md transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <span>Ingresar</span>
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
                  className="text-[11px] text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Cargar credenciales de prueba de Maximiliano
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <p className="text-[11px] text-gray-500">
              🔒 Tus datos y contraseñas viajan encriptados con hash bcrypt y firmas digitales JWT conforme a los estándares de seguridad web modernos.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
