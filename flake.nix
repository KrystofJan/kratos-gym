{
  description = "Nix language development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    alejandra.url = "github:kamadorueda/alejandra/3.1.0";
    alejandra.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = {
    systems,
    nixpkgs,
    alejandra,
    ...
  } @ inputs: let
    eachSystem = f:
      nixpkgs.lib.genAttrs (import systems) (system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in
        f {
          pkgs = pkgs;
          system = system;
        });
  in {
    devShells = eachSystem (
      args: let
        pkgs = args.pkgs;
        system = args.system;
      in {
        default = pkgs.mkShell {
          packages = with pkgs;[
            nodejs_22

            nodePackages.typescript 
            nodePackages.typescript-language-server
	    tailwindcss-language-server
            prettierd
	    eslint

            nodePackages_latest.ts-node
            nodePackages_latest.nodemon    

            python311
            python311Packages.pip
            python311Packages.pipx
            python311Packages.numpy
            python311Packages.pyarrow
            python311Packages.pytest
	    python311Packages.faker
	    pyright
	    harlequin

	    go
	    gopls

	    texlive.combined.scheme-full
	    texlab
	  ];

          shellHook = ''
            echo "  Nix development flake   "
            echo " Let's nix it up  "
          '';

        };
      }
    );
  };
}


