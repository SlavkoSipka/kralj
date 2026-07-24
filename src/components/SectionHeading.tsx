interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';
  return (
    <div
      className={`${isCenter ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'} ${className}`}
    >
      {eyebrow && (
        <span className="eyebrow scroll-animate">{eyebrow}</span>
      )}
      <h2
        className="heading text-ts-h4 md:text-ts-h2 mt-6 scroll-animate delay-100"
        style={{ fontFamily: 'Playfair Display' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-ts-h6 leading-relaxed opacity-80 scroll-animate delay-200">
          {subtitle}
        </p>
      )}
      <div className={`gold-rule mt-7 scroll-animate delay-300 ${isCenter ? '' : 'mx-0'}`} />
    </div>
  );
};

export default SectionHeading;
