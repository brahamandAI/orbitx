import React, { useState, useEffect } from 'react';

const AuthModal = ({ onClose, onLogin, onGuestMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(formData);
    }
  };

  const handleGuestMode = () => {
    if (onGuestMode) {
      onGuestMode();
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center overflow-hidden w-screen h-screen">
      {/* Ultra Dynamic Animated Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950">
        {/* Video Background Layer */}
        <video
          autoPlay 
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/homevideo.mp4" type="video/mp4" />
        </video>

        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-600/15 via-indigo-600/15 to-violet-600/15 animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/15 via-fuchsia-600/15 to-purple-600/15 animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        </div>

        {/* Mega Floating Orbs */}
        <div className="absolute top-1/4 left-1/6 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/6 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '7s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-pink-500/25 to-rose-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '6.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-[450px] h-[450px] bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '7.5s' }} />

        {/* Floating Stars/Particles */}
        {[...Array(100)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#60a5fa', '#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24'][Math.floor(Math.random() * 6)],
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              boxShadow: '0 0 15px currentColor'
            }}
          />
        ))}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Modal Container */}
      <div className={`relative w-full h-screen md:max-h-[80vh] flex flex-col md:flex-row items-center justify-center transform transition-all duration-1000 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Epic Glow Effect */}
        <div className="absolute -inset-2 sm:-inset-4 md:-inset-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-none md:rounded-3xl blur-xl sm:blur-2xl md:blur-3xl opacity-90 animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute -inset-1 sm:-inset-3 md:-inset-4 bg-gradient-to-r from-cyan-600 via-violet-600 to-fuchsia-600 rounded-none md:rounded-3xl blur-lg sm:blur-xl md:blur-2xl opacity-70 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></div>
        <div className="absolute -inset-0.5 sm:-inset-2 md:-inset-2 bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 rounded-none md:rounded-3xl blur-md sm:blur-lg md:blur-xl opacity-60 animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>

        {/* Modal Content */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-2xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden border border-white/20 mx-2 md:mx-4 my-4 md:my-0">
          <div className="flex flex-col md:flex-row min-h-[500px] md:min-h-[400px] lg:min-h-[450px]">
            
            {/* LEFT SIDE - Branding & Visual Experience */}
            <div className="relative w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-2 sm:p-3 md:p-4 lg:p-6 flex flex-col justify-center items-center overflow-hidden min-h-[40vh] md:min-h-0">
              {/* Animated Background Layers */}
              <div className="absolute inset-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                >
                  <source src="/homevideo.mp4" type="video/mp4" />
                </video>
                
                {/* Mesh Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/40 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/30 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
              </div>

              {/* Animated Rings */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`ring-${i}`}
                  className="absolute border-2 border-white/20 rounded-full"
                  style={{
                    width: `${150 + i * 70}px`,
                    height: `${150 + i * 70}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: `ping ${3 + i}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                    animationDelay: `${i * 0.4}s`
                  }}
                />
              ))}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 z-20 backdrop-blur-sm hover:rotate-90 hover:scale-110"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Logo Animation */}
                <div className="mb-2 sm:mb-3 md:mb-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-auto relative">
                    {/* Smooth Pulsing Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-80 animate-pulse" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                    
                    {/* Logo Container */}
                    <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white/30 hover:scale-110 transition-transform duration-500">
                      <video
                        src="/orbitxlogo.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Smooth Rotating Circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-28 h-28 border-4 border-white/40 border-t-white/80 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-36 h-36 border-2 border-white/20 border-b-white/60 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-44 h-44 border border-white/10 border-r-white/40 rounded-full animate-spin" style={{ animationDuration: '15s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Branding */}
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black text-white mb-1 sm:mb-1 md:mb-2 tracking-tight transform hover:scale-110 transition-transform duration-500">
                  <span className="inline-block hover:animate-pulse">Orbit</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-pulse inline-block">X</span>
                </h1>
                
                <p className="text-blue-50 text-xs sm:text-xs md:text-sm lg:text-sm font-bold mb-1 sm:mb-1 drop-shadow-lg">
                  🚀 Your Digital Universe Awaits
                </p>
                
                <p className="text-blue-100/90 text-xs sm:text-xs md:text-xs lg:text-sm mb-2 sm:mb-2 md:mb-3 max-w-md mx-auto hidden sm:block">
                  Experience browsing reimagined with AI-powered search, beautiful interface, and lightning-fast performance
                </p>

                {/* Feature Pills */}
                <div className="space-y-0.5 sm:space-y-0.5 md:space-y-1 max-w-xs sm:max-w-sm mx-auto hidden sm:block">
                  {[
                    { icon: '🤖', text: 'AI-Powered Intelligence', color: 'from-blue-400 to-cyan-400' },
                    { icon: '⚡', text: 'Lightning Fast Speed', color: 'from-yellow-400 to-orange-400' },
                    { icon: '🎨', text: 'Beautiful Modern UI', color: 'from-pink-400 to-purple-400' },
                    { icon: '🔒', text: 'Secure & Private', color: 'from-green-400 to-emerald-400' }
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-1 sm:space-x-1 bg-white/10 backdrop-blur-sm rounded-sm sm:rounded-md p-1 sm:p-1 md:p-1.5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <span className="text-xs sm:text-xs md:text-sm">{feature.icon}</span>
                      <span className={`font-medium text-xs sm:text-xs md:text-xs text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Download App Button */}
                <div className="mt-3 sm:mt-4 md:mt-5 max-w-xs sm:max-w-sm mx-auto">
                  <button className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-black py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 group border-2 border-white/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base group-hover:tracking-wide transition-all duration-300">Download App</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <p className="text-center text-white/70 text-xs mt-2">
                    Available for Android, iOS & Desktop
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="relative w-full md:w-1/2 p-2 sm:p-3 md:p-4 lg:p-6 flex flex-col justify-center items-center">
              {/* Animated Background for Form Side */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-pink-500/15 to-rose-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>

              {/* Floating Mini Particles */}
              {[...Array(40)].map((_, i) => (
                <div
                  key={`mini-${i}`}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#60a5fa', '#a78bfa', '#f472b6', '#22d3ee'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    boxShadow: '0 0 8px currentColor'
                  }}
                />
              ))}

              {/* Form Content */}
              <div className="relative z-10 w-full max-w-[400px] px-4 md:px-8">
                {/* Welcome Header */}
                <div className="text-center mb-2 sm:mb-3 md:mb-3">
                  <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-1 sm:mb-1 animate-pulse">
                    {isLogin ? 'Welcome!' : 'Join OrbitX'}
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-xs md:text-xs lg:text-sm font-medium">
                    {isLogin ? '✨ Sign in to continue your cosmic journey' : '🚀 Create your account and explore'}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex mb-1 sm:mb-2 md:mb-3 bg-gray-800/60 backdrop-blur-sm rounded-md sm:rounded-lg p-1 sm:p-1 border border-white/10">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-1.5 sm:py-2 md:py-2 px-2 sm:px-2 md:px-3 rounded-md sm:rounded-lg font-bold transition-all duration-300 text-xs sm:text-xs md:text-xs ${
                      isLogin
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-1.5 sm:py-2 md:py-2 px-2 sm:px-2 md:px-3 rounded-md sm:rounded-lg font-bold transition-all duration-300 text-xs sm:text-xs md:text-xs ${
                      !isLogin
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Sign Up</span>
                    </div>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-1.5 md:space-y-2">
                  {!isLogin && (
                    <div className="transform hover:scale-105 transition-transform duration-300">
                      <label className="block text-sm font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                        ✨ Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-2 sm:px-3 md:px-3 py-1.5 sm:py-2 md:py-2 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-blue-500/20 text-xs sm:text-sm"
                        placeholder="Enter your awesome name"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-2 sm:px-3 md:px-3 py-1.5 sm:py-2 md:py-2 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-purple-500/20 text-xs sm:text-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-2">
                      🔒 Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-2 sm:px-3 md:px-3 py-1.5 sm:py-2 md:py-2 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:ring-4 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-pink-500/20 text-xs sm:text-sm"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center text-gray-400 cursor-pointer hover:text-white transition-colors group">
                        <input type="checkbox" className="mr-2 rounded accent-purple-600" />
                        <span className="group-hover:text-blue-300 transition-colors">Remember me</span>
                      </label>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold hover:underline">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-1.5 sm:py-2 md:py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black text-xs sm:text-sm md:text-sm rounded-lg sm:rounded-xl hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="group-hover:tracking-wider transition-all duration-300">
                        {isLogin ? 'Launch OrbitX 🚀' : 'Create Account ✨'}
                      </span>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-2 sm:my-2 md:my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 sm:px-4 md:px-6 bg-gray-900/90 backdrop-blur-sm text-gray-400 font-bold text-xs sm:text-sm">or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2 mb-2 sm:mb-3 md:mb-3">
                  <button className="flex items-center justify-center px-2 sm:px-3 md:px-3 py-1.5 sm:py-2 md:py-2 bg-gray-800/60 backdrop-blur-sm border-2 border-gray-700/50 rounded-lg sm:rounded-xl hover:bg-gray-700/60 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group transform hover:scale-105">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                      </svg>
                      <span className="text-white font-bold text-xs sm:text-sm md:text-base group-hover:text-blue-300 transition-colors">Google</span>
                    </div>
                  </button>
                  <button className="flex items-center justify-center px-2 sm:px-3 md:px-3 py-1.5 sm:py-2 md:py-2 bg-gray-800/60 backdrop-blur-sm border-2 border-gray-700/50 rounded-lg sm:rounded-xl hover:bg-gray-700/60 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group transform hover:scale-105">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                      <span className="text-white font-bold text-xs sm:text-sm md:text-base group-hover:text-purple-300 transition-colors">GitHub</span>
                    </div>
                  </button>
                </div>

                {/* Guest Mode Button */}
                <button
                  onClick={handleGuestMode}
                  className="w-full py-1.5 sm:py-2 md:py-2 bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-gray-600/70 text-gray-300 font-bold rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-gray-700/70 hover:via-blue-900/40 hover:to-purple-900/40 hover:border-blue-500 hover:text-white hover:border-solid transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-2 group transform hover:scale-105"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-blue-400 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm sm:text-base md:text-lg group-hover:tracking-wide transition-all duration-300">Continue as Guest</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-2 group-hover:text-blue-400 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-1 sm:mt-2 md:mt-2">
                  By continuing, you agree to OrbitX's{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors hover:underline font-semibold">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors hover:underline font-semibold">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
