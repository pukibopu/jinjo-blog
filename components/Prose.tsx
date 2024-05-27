import clsx from "clsx"

const Prose = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <div className={clsx(className, 'prose dark:prose-invert')}>
            {children}
        </div>
    )
}

export default Prose