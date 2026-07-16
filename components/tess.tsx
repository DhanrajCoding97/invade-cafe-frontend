{socialLinks.map(({ icon: Icon, href, label }) => key={label} href={href} target="_blank"rel="noopener noreferrer"
                aria-label={label}
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-md border border-cyan-400/40
                  text-cyan-400
                  transition-colors
                  hover:bg-cyan-400/10
                "
              >
                // <Icon className="h-4 w-4" />
              </a>
            ))}