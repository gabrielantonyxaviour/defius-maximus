import Image from "next/image";

export default function Humanity() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center pt-2">
      <div className="relative bg-[#1F1F1F] w-[100%] md:w-[700px] 2xl:h-[50%] h-[75%] sm:h-[60%] rounded-xl mx-auto">
        <div className="flex flex-col items-center w-full h-full py-6">
          <Image
            src={"/humanity.png"}
            alt="Humanity"
            width={180}
            height={180}
            className="rounded-xl pt-2"
          />
        </div>
      </div>
    </div>
  );
}
