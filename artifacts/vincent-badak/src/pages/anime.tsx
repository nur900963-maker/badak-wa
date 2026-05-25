import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";

export default function Anime() {
  // Generate random heights for a masonry-like look
  const items = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    heightClass: ["h-40", "h-48", "h-64", "h-56"][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight">ANIME <span className="text-primary">GALLERY</span></h1>
        <p className="text-sm text-muted-foreground">Baldwin Collection</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5 relative group ${item.heightClass}`}
          >
            <img 
              src={baldwinImg} 
              alt="Anime Character" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}