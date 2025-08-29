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
      className="relative w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px]"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex items-center justify-center h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white text-center mt-16 md:mt-0">
          {title}
        </h1>
      </div>
    </section>
  );
}

export default HeroSection;


