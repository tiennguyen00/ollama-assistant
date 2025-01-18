import CharacterSelection from "./CharacterSelection";

const Hero = () => {
  return (
    <section className="flex justify-center align-center">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="font-bold text-7xl text-blue-dark">LLAMA ASSITANT</h1>
      </div>
      <CharacterSelection />
    </section>
  );
};

export default Hero;
