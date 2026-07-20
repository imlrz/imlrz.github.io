% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% A new style for FAIR pre-prints
% Author: dlp@meta.com
% Version: 1.1
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Class declarations %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{meta}[2026/07/20 Wenxiaobai Meta paper template]
\newcommand{\paperaccenthex}{2E5AA8}
\newcommand{\papertinthex}{E6EDFA}
\newcommand{\papersofthex}{F1F4F7}
\newcommand{\paperlinehex}{B8C4D8}
\newcommand{\paperlogofile}{wenxiaobai-icon-black.png}
\newif\ifpaperfancycite
\paperfancycitefalse
\DeclareOption{blue}{%
  \renewcommand{\paperaccenthex}{2E5AA8}%
  \renewcommand{\papertinthex}{E6EDFA}%
  \renewcommand{\papersofthex}{F1F4F7}%
  \renewcommand{\paperlinehex}{B8C4D8}}
\DeclareOption{purple}{%
  \renewcommand{\paperaccenthex}{514AA3}%
  \renewcommand{\papertinthex}{ECEAF8}%
  \renewcommand{\papersofthex}{F5F3FA}%
  \renewcommand{\paperlinehex}{C9C3E5}}
\DeclareOption{red}{%
  \renewcommand{\paperaccenthex}{8A3048}%
  \renewcommand{\papertinthex}{F4E7EB}%
  \renewcommand{\papersofthex}{F8F2F4}%
  \renewcommand{\paperlinehex}{DAB9C3}}
\DeclareOption{yellow}{%
  \renewcommand{\paperaccenthex}{A56510}%
  \renewcommand{\papertinthex}{F7EDDC}%
  \renewcommand{\papersofthex}{F9F5EC}%
  \renewcommand{\paperlinehex}{DCC7A2}}
\DeclareOption{normalcite}{\paperfancycitefalse}
\DeclareOption{fancycite}{\paperfancycitetrue}
\DeclareOption{blacklogo}{\renewcommand{\paperlogofile}{wenxiaobai-icon-black.png}}
\DeclareOption{colorlogo}{\renewcommand{\paperlogofile}{wenxiaobai-icon-color.png}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ExecuteOptions{blue,normalcite,blacklogo}
\ProcessOptions\relax
\LoadClass{article}

% Layout %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage[top=2.25cm, bottom=2.5cm, left=2.5cm, right=2.5cm, columnsep=0.65cm]{geometry}
\RequirePackage{microtype}
\RequirePackage{placeins}
\RequirePackage{hyphenat}
\RequirePackage{setspace}
\RequirePackage{parskip}
\RequirePackage[latin, english]{babel}
\RequirePackage{lipsum}
\RequirePackage{etoolbox}

\DisableLigatures[f]{family=sf*} 

% Graphics %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{graphicx}
\RequirePackage{subcaption}

% Tables %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{booktabs}
\RequirePackage{nicematrix}
\RequirePackage{multirow}
\RequirePackage{bm}
\newcommand{\nm}[1]{#1}

% Colorful stuff %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage[most]{tcolorbox}
\RequirePackage{xcolor}
\definecolor{metablue}{HTML}{\paperaccenthex}
\definecolor{metafg}{HTML}{1C2B33}
\definecolor{metabg}{HTML}{\papersofthex}
\definecolor{brandblue}{HTML}{\paperaccenthex}
\definecolor{brandbg}{HTML}{\papertinthex}
\definecolor{brandsoft}{HTML}{\papersofthex}
\definecolor{brandline}{HTML}{\paperlinehex}

% References %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{hyperref}
\RequirePackage[noabbrev,nameinlink]{cleveref}
\ifpaperfancycite
  \hypersetup{colorlinks,linkcolor=metablue,citecolor=metablue,urlcolor=metablue}
\else
  \hypersetup{colorlinks,linkcolor=metablue,citecolor=metafg,urlcolor=metablue}
\fi

\RequirePackage[round,authoryear]{natbib}
\ifpaperfancycite
  \setcitestyle{square,semicolon}
  \renewcommand\NAT@nmfmt[1]{{\sffamily\bfseries #1}}
\else
  \setcitestyle{round,semicolon}
\fi
\def\bibfont{\small}

% Section and caption format %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{titlesec}
\titleformat*{\paragraph}{\itshape}
\titleformat*{\section}{\Large\sffamily\bfseries}
\titleformat*{\subsection}{\large\sffamily\bfseries}
\titleformat*{\subsubsection}{\normalsize\sffamily\bfseries}
\DeclareTextFontCommand{\textbf}{\bfseries\sffamily}

\RequirePackage{caption}
\DeclareCaptionLabelSeparator{custom}{}
\DeclareCaptionFormat{custom}{{\sffamily\textbf{#1 #2}} #3}
\captionsetup{singlelinecheck=false,format=custom,labelsep=custom,font=small}
\captionsetup[sub]{singlelinecheck=true,format=custom,labelsep=custom,font=small}

% Meta custom fonts %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% http://c.caignaert.free.fr/Install-ttf-Font.pdf

\renewcommand*\ttdefault{cmvtt}
\RequirePackage[T1]{fontenc}

% \pdfmapline{+optimistic < assets/Optimistic.ttf <T1-WGL4.enc}
% \renewcommand{\sfdefault}{optimistic}

\DeclareFontFamily{T1}{optimistic}{}
\DeclareFontShape{T1}{optimistic}{m}{n}{<-> s * [0.88] optimistic}{}
\DeclareFontShape{T1}{optimistic}{b}{n}{<-> s * [0.88] optimistic}{}
\pdfmapline{+optimistic < Optimistic.ttf <T1-WGL4.enc}
\renewcommand{\sfdefault}{optimistic}

% Authors, affiliations, infos %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\renewcommand\addtolist[5][]{
  \begingroup
    \if\relax#3\relax\def\sep{}\else\def\sep{#5}\fi
    \let\protect\@unexpandable@protect 
    \xdef#3{\expandafter{#3}\sep #4[#1]{#2}}%
  \endgroup
}

\newcommand\authorlist{}
\newcommand\authorformat[2][]{{\sffamily \bfseries #2$^{#1}$}}
\renewcommand\author[2][]{\addtolist[#1]{#2}{\authorlist}{\authorformat}{, }}

\newcommand\affiliationlist{}
\newcommand\affiliationformat[2][]{{\normalsize $^{#1}$#2}}
\newcommand\affiliation[2][]{\addtolist[#1]{#2}{\affiliationlist}{\affiliationformat}{, }}

\newcommand\contributionlist{}
\newcommand\contributionformat[2][]{{\small $^{#1}$#2}}
\newcommand\contribution[2][]{\addtolist[#1]{#2}{\contributionlist}{\contributionformat}{, }}

\newcommand\metadatalist{}
\newcommand\metadataformat[2][]{{\small {\sffamily \bfseries #1:} #2}}
\newcommand\metadata[2][]{\addtolist[#1]{#2}{\metadatalist}{\metadataformat}{\par}}

\renewcommand{\abstract}[1]{\def\abstractlist{{\color{metafg} #1}}}
\newcommand{\email}[1]{\href{mailto:#1}{\texttt{#1}}}

\renewcommand\date[1]{\metadata[Date]{#1}}
\newcommand\correspondence[1]{\metadata[Correspondence]{#1}}

\renewcommand{\title}[1]{\newcommand{\titlelist}{{\huge\sffamily\bfseries #1}}}

\newcommand{\beginappendix}{\appendix{\huge\sffamily Appendix\par}}

% Titlebox %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


\newcommand{\mymaketitle}{%
  \tcbset{enhanced,frame hidden}
  \tcbset{left=0.5cm}
  \tcbset{right=0.5cm}
  \tcbset{top=0.5cm}
  \tcbset{bottom=0.5cm}
  \tcbset{arc=10pt}
  \tcbset{colback=metabg}
  \tcbset{before skip=0pt}
  \tcbset{grow to left by=1.5pt}
  \tcbset{grow to right by=1.5pt}
  \tcbset{overlay={\node[
    anchor=south east,
    at= (frame.south east),
    xshift=-0.5cm,
    yshift=0.5cm] {\makebox[4.35cm][r]{%
      \includegraphics[width=3.15cm]{assets/ustc-wordmark.png}%
      \hspace{0.25cm}%
      \includegraphics[height=0.55cm]{assets/\paperlogofile}}};}}
  % 
  \begin{tcolorbox}
    \setlength{\parindent}{0cm}
    \setlength{\parskip}{0.5cm}
    {
      \setlength{\parskip}{0cm}
      \raggedright
      \nohyphens
      %
      {
        \setstretch{1.618}
        \titlelist\par
      }
      \vskip 0.2cm
      %
      \authorlist\par
      \vskip 0.2cm
      %
      \affiliationlist\par
      %
      \contributionlist\par
    }
    %
    \abstractlist\par
    %
    \vskip 0.5cm
    %
    {
      \setlength{\parskip}{0cm}
      \ifdefempty{\metadatalist}{\vspace*{0.65cm}}{\metadatalist\par}
    }
  \end{tcolorbox}
  \tcbset{reset}
  \FloatBarrier
}

\if@twocolumn%
\renewcommand{\maketitle}{
\twocolumn[%
  \mymaketitle
  \vskip 0.38cm
]
}%
\else%
\renewcommand{\maketitle}{
  \mymaketitle
}%
\fi
