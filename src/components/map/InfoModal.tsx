interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Gunakan 'any' atau sesuaikan dengan key asli dari Geodesi
  data: any; 
}

export default function InfoModal({ isOpen, onClose, data }: InfoModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">📋 Detail Fasilitas</h3>
        <div className="space-y-3 my-4 border-t border-b py-3">
          {/* Mapping disesuaikan dengan key asli dari file GeoJSON Geodesi */}
          <p className="text-sm"><strong>Nama Aset:</strong> {data.NAMOBJ || "Tidak ada data"}</p>
          <p className="text-sm"><strong>Keterangan:</strong> {data.REMARK || "Tidak ada keterangan"}</p>
          
          {/* Kalau nanti file lain punya key berbeda, lu bisa tambahin fallback logic di sini */}
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity mt-2"
        >
          Tutup Detail
        </button>
      </div>
    </div>
  );
}