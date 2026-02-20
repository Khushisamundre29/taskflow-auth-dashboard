const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-[#1368EC]/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1368EC] animate-spin"></div>
          </div>
          <p className="text-white/40 text-sm tracking-widest uppercase font-light">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-[#1368EC]/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1368EC] animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;