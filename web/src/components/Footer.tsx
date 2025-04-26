import type { ComponentProps } from 'react'

type FooterProps = {
  className?: ComponentProps<'footer'>['className']
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`
			flex flex-col items-center bg-white text-gray-500 py-4 border-t border-gray-300
			${className}
			`}
    >
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Nexo. Todos os direitos reservados.
      </p>
      <div className="flex gap-2 text-sm text-gray-400">
        <a href="/privacy-policy" className=" hover:text-gray-500">
          Política de Privacidade
        </a>
        <a href="/terms-of-service" className=" hover:text-gray-500">
          Termos
        </a>
      </div>
    </footer>
  )
}

export default Footer
