import { Navbar } from "@/components/customized/navbar";

export default function Layout( { children }: { children: React.ReactNode } ) {
    return (
        <Navbar>
            {children}
        </Navbar>

    );
}