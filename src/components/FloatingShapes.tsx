const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-float opacity-50"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: '4s' }}></div>
      
      {/* Geometric Shapes */}
      <div className="absolute top-20 right-20 w-24 h-24 border-2 border-primary/20 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-32 left-20 w-32 h-32 border-2 border-secondary/20 rounded-full animate-pulse-glow"></div>
      <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-accent/10 to-primary/10 rotate-12 animate-float" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating Lines */}
      <div className="absolute top-40 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-float"></div>
      <div className="absolute bottom-40 right-1/4 w-px h-40 bg-gradient-to-b from-transparent via-secondary/30 to-transparent animate-float" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default FloatingShapes;
