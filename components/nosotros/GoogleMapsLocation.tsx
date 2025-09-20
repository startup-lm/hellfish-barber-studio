export default function GoogleMapsLocation() {
  return (
    <div className="w-full h-full mb-5 rounded-lg overflow-hidden border">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.836224319971!2d-58.507242123695775!3d-34.507036072989266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb17e53f11b03%3A0x6fa3c1e5f760f8a2!2sHellfish%20Barber%20Studio!5e0!3m2!1ses-419!2sar!4v1758391193986!5m2!1ses-419!2sar"
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        title="Dónde nos encontramos"
        aria-label="Mapa de Google mostrando la ubicación de Justo G. Bermudez 2480, Olivos, Provincia de Buenos Aires"
      />
    </div>
  );
}