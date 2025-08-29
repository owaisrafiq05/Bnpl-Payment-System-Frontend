interface HeroSectionProps {
  backgroundUrl?: string;
  title?: string;
}

function HeroSection({
  backgroundUrl = '/public/abanumber.gif',
  title = 'Make a Payment',
}: HeroSectionProps) {
  return (
    <section
      className="relative w-full"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-8 inset-0 bg-black/0" />
      <div className="relative top-24 mx-auto max-w-7xl px-4">
        <div className="py-20 md:py-28 lg:py-56">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white text-center">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;


