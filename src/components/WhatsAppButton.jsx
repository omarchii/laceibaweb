export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/529997481294"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:bg-green-600 transition"
    >
      <img src="/whatsapp.svg" alt="WhatsApp" className="w-12 h-12" />
    </a>
  );
}
