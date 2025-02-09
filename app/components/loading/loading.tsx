import Lottie from "lottie-react";
import location from "./Animation - 1738897742142.json";

export function LoadingLottie({ text }: { text?: string }) {
    return (


        <div>
            <Lottie
                animationData={location}
                style={{ height: '50%, width: 100%' }}
            />
            <p>{text || 'CARREGANDO'}</p>
        </div>
    )
}