import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";
 
//funções para páginas que só podem ser acessadas por visitantese
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext ): Promise<GetServerSidePropsResult<P>> => {

        //se acessar a pagina tendo login redirecionar
        const cookies = parseCookies(ctx)
        if(cookies['@nextauth.token']){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }

        return await fn(ctx);
    }

}