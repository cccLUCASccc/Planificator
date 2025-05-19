import LoginButton from "@/components/loginButton"

export default function SignIn(){
    return(
        <div className="container h-screen flex flex-col justify-center items-center">
            <h1 className="lg:text-[5rem] text-[2rem]">Sign in/Sign up</h1>
            <LoginButton/>
        </div>
    )
}