% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% A new style for FAIR pre-prints
% Author: dlp@meta.com
% Version: 1.1
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Class declarations %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{meta}[2026/07/24 Pada Meta paper template]
\newcommand{\paperaccenthex}{2E5AA8}
\newcommand{\papertinthex}{E6EDFA}
\newcommand{\papersofthex}{F1F4F7}
\newcommand{\papersoftsecondhex}{F1F4F7}
\newcommand{\paperlinehex}{B8C4D8}
\newcommand{\papercitehex}{00A7E8}
\newcommand{\paperbodyhex}{1C2B33}
\newcommand{\paperpagehex}{FFFFFF}
\newcommand{\papertitlefghex}{1C2B33}
\newcommand{\papertitlelinkhex}{8A97AB}
\newcommand{\paperbooktaghex}{294F83}
\newcommand{\paperlogofile}{pada-horizontal-light.png}
\newcommand{\paperlogowidth}{1.42cm}
\newif\ifpaperfancycite
\newif\ifpaperdarktitle
\newif\ifpapercolorheadings
\newif\ifpapergradienttitle
\newif\ifpaperroundtitle
\newif\ifpaperlategradient
\newif\ifpapersharpgradient
\newif\ifpapersegmentedtitle
\newif\ifpaperinsettitle
\paperfancycitefalse
\paperdarktitlefalse
\papercolorheadingsfalse
\papergradienttitlefalse
\paperroundtitlefalse
\paperlategradientfalse
\papersharpgradientfalse
\papersegmentedtitlefalse
\paperinsettitlefalse
\newcommand{\useappleairpalette}{%
  \renewcommand{\paperaccenthex}{596975}%
  \renewcommand{\papertinthex}{EEF1F3}%
  \renewcommand{\papersofthex}{B8B9BD}%
  \renewcommand{\papersoftsecondhex}{8B8E94}%
  \renewcommand{\paperlinehex}{D6DBDE}%
  \renewcommand{\papercitehex}{607985}%
  \renewcommand{\paperbodyhex}{2B3238}%
  \renewcommand{\paperpagehex}{FCFCFB}%
  \renewcommand{\papertitlefghex}{1F252A}%
  \renewcommand{\papertitlelinkhex}{3D4A55}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{ustc}{%
  \renewcommand{\paperaccenthex}{2E5AA8}%
  \renewcommand{\papertinthex}{E6EDFA}%
  \renewcommand{\papersofthex}{F1F4F7}%
  \renewcommand{\paperlinehex}{B8C4D8}%
  \renewcommand{\papercitehex}{00A7E8}%
  \renewcommand{\paperbooktaghex}{294F83}}
\DeclareOption{indigo}{%
  \renewcommand{\paperaccenthex}{514AA3}%
  \renewcommand{\papertinthex}{ECEAF8}%
  \renewcommand{\papersofthex}{F5F3FA}%
  \renewcommand{\paperlinehex}{C9C3E5}%
  \renewcommand{\papercitehex}{8E66FF}%
  \renewcommand{\paperbooktaghex}{493D86}}
\DeclareOption{wine}{%
  \renewcommand{\paperaccenthex}{8A3048}%
  \renewcommand{\papertinthex}{F4E7EB}%
  \renewcommand{\papersofthex}{F8F2F4}%
  \renewcommand{\paperlinehex}{DAB9C3}%
  \renewcommand{\papercitehex}{D94B6D}%
  \renewcommand{\paperbooktaghex}{823149}}
\DeclareOption{amber}{%
  \renewcommand{\paperaccenthex}{A56510}%
  \renewcommand{\papertinthex}{F7EDDC}%
  \renewcommand{\papersofthex}{F9F5EC}%
  \renewcommand{\paperlinehex}{DCC7A2}%
  \renewcommand{\papercitehex}{E09A24}%
  \renewcommand{\paperbooktaghex}{79500B}}
\DeclareOption{spacegray}{%
  \renewcommand{\paperaccenthex}{4E667A}%
  \renewcommand{\papertinthex}{EDF1F2}%
  \renewcommand{\papersofthex}{3C4D5E}%
  \renewcommand{\papersoftsecondhex}{3C4D5E}%
  \renewcommand{\paperlinehex}{C9D1D5}%
  \renewcommand{\papercitehex}{587B80}%
  \renewcommand{\paperbodyhex}{27323A}%
  \renewcommand{\paperpagehex}{FAFAF8}%
  \renewcommand{\papertitlefghex}{F5F5F2}%
  \renewcommand{\papertitlelinkhex}{BDCCD5}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{spaceindigo}{%
  \renewcommand{\paperaccenthex}{5A6179}%
  \renewcommand{\papertinthex}{EEEFF4}%
  \renewcommand{\papersofthex}{3D4052}%
  \renewcommand{\papersoftsecondhex}{3D4052}%
  \renewcommand{\paperlinehex}{C9CBD5}%
  \renewcommand{\papercitehex}{68718A}%
  \renewcommand{\paperbodyhex}{2C2E3A}%
  \renewcommand{\paperpagehex}{FAFAF9}%
  \renewcommand{\papertitlefghex}{F5F4F2}%
  \renewcommand{\papertitlelinkhex}{C6C8D7}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{spaceteal}{%
  \renewcommand{\paperaccenthex}{4F6B6D}%
  \renewcommand{\papertinthex}{EAF0EF}%
  \renewcommand{\papersofthex}{374C4E}%
  \renewcommand{\papersoftsecondhex}{374C4E}%
  \renewcommand{\paperlinehex}{C6D1CF}%
  \renewcommand{\papercitehex}{5D7A77}%
  \renewcommand{\paperbodyhex}{283638}%
  \renewcommand{\paperpagehex}{F8FAF8}%
  \renewcommand{\papertitlefghex}{F3F5F2}%
  \renewcommand{\papertitlelinkhex}{C1D1CF}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{spaceviolet}{%
  \renewcommand{\paperaccenthex}{625B70}%
  \renewcommand{\papertinthex}{F0EDF2}%
  \renewcommand{\papersofthex}{443E4C}%
  \renewcommand{\papersoftsecondhex}{443E4C}%
  \renewcommand{\paperlinehex}{D0CAD4}%
  \renewcommand{\papercitehex}{736B7F}%
  \renewcommand{\paperbodyhex}{302C35}%
  \renewcommand{\paperpagehex}{FAF9FA}%
  \renewcommand{\papertitlefghex}{F6F3F4}%
  \renewcommand{\papertitlelinkhex}{D1C7D4}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{spacegraphite}{%
  \renewcommand{\paperaccenthex}{606A73}%
  \renewcommand{\papertinthex}{EDEFF0}%
  \renewcommand{\papersofthex}{484D52}%
  \renewcommand{\papersoftsecondhex}{484D52}%
  \renewcommand{\paperlinehex}{CED2D5}%
  \renewcommand{\papercitehex}{6B7C84}%
  \renewcommand{\paperbodyhex}{30353A}%
  \renewcommand{\paperpagehex}{FAFAF8}%
  \renewcommand{\papertitlefghex}{F4F4F1}%
  \renewcommand{\papertitlelinkhex}{C9D0D4}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{applegray}{%
  \renewcommand{\paperaccenthex}{59666F}%
  \renewcommand{\papertinthex}{EEF1F2}%
  \renewcommand{\papersofthex}{6B737A}%
  \renewcommand{\papersoftsecondhex}{6B737A}%
  \renewcommand{\paperlinehex}{D4D9DC}%
  \renewcommand{\papercitehex}{5E7880}%
  \renewcommand{\paperbodyhex}{2D3439}%
  \renewcommand{\paperpagehex}{FBFBFA}%
  \renewcommand{\papertitlefghex}{FCFBF8}%
  \renewcommand{\papertitlelinkhex}{E2E6E8}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{applebluegray}{%
  \renewcommand{\paperaccenthex}{556B78}%
  \renewcommand{\papertinthex}{EDF2F4}%
  \renewcommand{\papersofthex}{65727A}%
  \renewcommand{\papersoftsecondhex}{65727A}%
  \renewcommand{\paperlinehex}{D1DADF}%
  \renewcommand{\papercitehex}{5A7680}%
  \renewcommand{\paperbodyhex}{29353B}%
  \renewcommand{\paperpagehex}{FAFBFB}%
  \renewcommand{\papertitlefghex}{FCFBF8}%
  \renewcommand{\papertitlelinkhex}{DCE6EA}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{appletitanium}{%
  \renewcommand{\paperaccenthex}{656560}%
  \renewcommand{\papertinthex}{F1F0ED}%
  \renewcommand{\papersofthex}{706F6B}%
  \renewcommand{\papersoftsecondhex}{706F6B}%
  \renewcommand{\paperlinehex}{D9D7D2}%
  \renewcommand{\papercitehex}{6B7475}%
  \renewcommand{\paperbodyhex}{343431}%
  \renewcommand{\paperpagehex}{FBFAF8}%
  \renewcommand{\papertitlefghex}{FCFBF8}%
  \renewcommand{\papertitlelinkhex}{E5E2DC}%
  \paperdarktitletrue
  \papercolorheadingstrue}
\DeclareOption{appleairm1}{%
  \useappleairpalette
  \papergradienttitletrue}
\DeclareOption{appleairflat}{%
  \useappleairpalette
  \renewcommand{\papersofthex}{A4A6AB}%
  \renewcommand{\papersoftsecondhex}{A4A6AB}}
\DeclareOption{appleairroundflat}{%
  \useappleairpalette
  \renewcommand{\papersofthex}{A4A6AB}%
  \renewcommand{\papersoftsecondhex}{A4A6AB}%
  \paperroundtitletrue}
\DeclareOption{appleairlate}{%
  \useappleairpalette
  \papergradienttitletrue
  \paperlategradienttrue}
\DeclareOption{appleairroundlate}{%
  \useappleairpalette
  \papergradienttitletrue
  \paperlategradienttrue
  \paperroundtitletrue}
\DeclareOption{appleairroundsharp}{%
  \useappleairpalette
  \renewcommand{\papersoftsecondhex}{59636B}%
  \papergradienttitletrue
  \paperroundtitletrue
  \papersharpgradienttrue}
\DeclareOption{appleairroundsegmented}{%
  \useappleairpalette
  \renewcommand{\papersofthex}{D5D7D9}%
  \renewcommand{\papersoftsecondhex}{59636B}%
  \paperroundtitletrue
  \papersegmentedtitletrue}
\DeclareOption{ustcinset}{%
  \renewcommand{\paperaccenthex}{2E5AA8}%
  \renewcommand{\papertinthex}{E6EDFA}%
  \renewcommand{\papersofthex}{F1F4F7}%
  \renewcommand{\paperlinehex}{B8C4D8}%
  \renewcommand{\papercitehex}{00A7E8}%
  \paperinsettitletrue}
\DeclareOption{normalcite}{\paperfancycitefalse}
\DeclareOption{fancycite}{\paperfancycitetrue}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ExecuteOptions{ustc,normalcite}
\ProcessOptions\relax
\LoadClass{article}

% Layout %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage[top=2.25cm, bottom=2.5cm, left=2.5cm, right=2.5cm, columnsep=0.65cm]{geometry}
\RequirePackage{microtype}
\RequirePackage{placeins}
\RequirePackage{hyphenat}
\RequirePackage{setspace}
\RequirePackage{parskip}
\RequirePackage{needspace}
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
\definecolor{metafg}{HTML}{\paperbodyhex}
\definecolor{metabg}{HTML}{\papersofthex}
\definecolor{metabgsecond}{HTML}{\papersoftsecondhex}
\definecolor{brandblue}{HTML}{\paperaccenthex}
\definecolor{brandbg}{HTML}{\papertinthex}
\definecolor{brandsoft}{HTML}{\papersofthex}
\definecolor{brandline}{HTML}{\paperlinehex}
\definecolor{metacite}{HTML}{\papercitehex}
\definecolor{metapage}{HTML}{\paperpagehex}
\definecolor{metatitlefg}{HTML}{\papertitlefghex}
\definecolor{metatitlelink}{HTML}{\papertitlelinkhex}
\definecolor{booktagbg}{HTML}{\paperbooktaghex}
\ifpaperlategradient
  \pgfdeclareverticalshading{appleairlate}{100bp}{%
    color(0bp)=(metabgsecond); color(42bp)=(metabg); color(100bp)=(metabg)}
\fi
\ifpapersharpgradient
  \pgfdeclareverticalshading{appleairsharp}{100bp}{%
    color(0bp)=(metabgsecond); color(11bp)=(metabgsecond!72!metabg);%
    color(26bp)=(metabg); color(100bp)=(metabg)}
\fi
\AtBeginDocument{\pagecolor{metapage}\color{metafg}}

% References %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{hyperref}
\RequirePackage[noabbrev,nameinlink]{cleveref}
\ifpaperfancycite
  \hypersetup{colorlinks,linkcolor=metablue,citecolor=metacite,urlcolor=metablue}
\else
  \hypersetup{colorlinks,linkcolor=metablue,citecolor=metablue,urlcolor=metablue}
\fi

\RequirePackage[round,authoryear]{natbib}
\setcitestyle{round,semicolon}
\def\bibfont{\small}

% Section and caption format %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{titlesec}
\ifpapercolorheadings
  \titleformat*{\paragraph}{\itshape\color{metablue}}
  \titleformat*{\section}{\Large\sffamily\bfseries\color{metablue}}
  \titleformat*{\subsection}{\large\sffamily\bfseries\color{metablue}}
  \titleformat*{\subsubsection}{\normalsize\sffamily\bfseries\color{metablue}}
\else
  \titleformat*{\paragraph}{\itshape}
  \titleformat*{\section}{\Large\sffamily\bfseries}
  \titleformat*{\subsection}{\large\sffamily\bfseries}
  \titleformat*{\subsubsection}{\normalsize\sffamily\bfseries}
\fi
\DeclareTextFontCommand{\textbf}{\bfseries\sffamily}
\pretocmd{\section}{\Needspace{6\baselineskip}}{}{}

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

\renewcommand{\abstract}[1]{\def\abstractlist{{\color{metatitlefg} #1}}}
\newcommand{\email}[1]{\href{mailto:#1}{\texttt{#1}}}

\renewcommand\date[1]{\metadata[Date]{#1}}
\newcommand\correspondence[1]{\metadata[Correspondence]{#1}}

\renewcommand{\title}[1]{\newcommand{\titlelist}{{\huge\sffamily\bfseries #1}}}

\newcommand{\beginappendix}{\appendix{\huge\sffamily Appendix\par}}

% Titlebox %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand{\myinsettitle}{%
  \begingroup
  \setlength{\parskip}{0pt}
  \vspace*{0.5cm}
  \begin{tcolorbox}[enhanced,frame hidden,boxsep=0pt,
    left=0.5cm,right=0.5cm,top=0.5cm,bottom=0.5cm,
    colback=metabg,coltext=metafg,arc=10pt,
    before skip=0pt,after skip=0pt,
    grow to left by=1.5pt,grow to right by=1.5pt]
    \setlength{\parindent}{0cm}
    \setlength{\parskip}{0cm}
    \raggedright\nohyphens
    {\setstretch{1.618}\titlelist\par}
    \vskip 0.2cm
    \authorlist\par
    \vskip 0.2cm
    \affiliationlist\par
    \contributionlist\par
    \vskip 0.34cm
    \begin{tcolorbox}[enhanced,
      colback=white,colframe=brandline!72!white,boxrule=0.35pt,
      left=0.42cm,right=0.42cm,top=0.38cm,bottom=0.95cm,
      arc=9pt,
      overlay={\node[anchor=south east,at=(frame.south east),
        xshift=-0.42cm,yshift=0.35cm,inner sep=0pt]{%
        \includegraphics[width=\paperlogowidth]{assets/\paperlogofile}};}]
      \abstractlist\par
    \end{tcolorbox}
    \vskip 0.34cm
    \ifdefempty{\metadatalist}{}{\metadatalist\par}
  \end{tcolorbox}
  \tcbset{reset}
  \FloatBarrier
  \endgroup
}

\newcommand{\mysegmentedtitle}{%
  \begingroup
  \setlength{\parskip}{0pt}
  \hypersetup{linkcolor=metatitlelink,citecolor=metatitlelink,urlcolor=metatitlelink}
  \vspace*{0.5cm}
  \begin{tcolorbox}[enhanced,frame hidden,boxsep=0pt,
    left=0.5cm,right=0.5cm,top=0.5cm,bottom=0.45cm,
    colback=metabg,coltext=metatitlefg,arc=10pt,sharp corners=south,
    before skip=0pt,after skip=0pt,
    grow to left by=1.5pt,grow to right by=1.5pt]
    \setlength{\parindent}{0cm}
    \setlength{\parskip}{0.5cm}
    {
      \setlength{\parskip}{0cm}
      \raggedright
      \nohyphens
      {\setstretch{1.618}\titlelist\par}
      \vskip 0.2cm
      \authorlist\par
      \vskip 0.2cm
      \affiliationlist\par
      \contributionlist\par
    }
    \vskip 0.28cm
    {\color{metatitlelink!45!metabg}\hrule height 0.35pt}
    \vskip 0.28cm
    \abstractlist\par
  \end{tcolorbox}
  % The tonal change is confined to this short, continuous material transition.
  \vspace*{-1pt}
  \nointerlineskip
  \noindent\begin{tikzpicture}[baseline=0pt]
    \shade[top color=metabg,bottom color=metabgsecond] (0,0) rectangle (\linewidth,0.16cm);
  \end{tikzpicture}\par
  \vspace*{-1pt}\nointerlineskip
  \begin{tcolorbox}[enhanced,frame hidden,boxsep=0pt,
    left=0.5cm,right=0.5cm,top=0.34cm,bottom=0.5cm,
    colback=metabgsecond,coltext=white,arc=10pt,sharp corners=north,
    before skip=0pt,after skip=0pt,
    grow to left by=1.5pt,grow to right by=1.5pt,
    overlay={\node[anchor=south east,at=(frame.south east),
      xshift=-0.5cm,yshift=0.45cm,inner sep=0pt]{%
      \includegraphics[width=\paperlogowidth]{assets/\paperlogofile}};}]
    \setlength{\parskip}{0cm}
    \hypersetup{linkcolor=white,citecolor=white,urlcolor=white}
    \ifdefempty{\metadatalist}{\vspace*{0.65cm}}{\metadatalist\par}
  \end{tcolorbox}
  \ifpaperfancycite
    \hypersetup{linkcolor=metablue,citecolor=metacite,urlcolor=metablue}
  \else
    \hypersetup{linkcolor=metablue,citecolor=metablue,urlcolor=metablue}
  \fi
  \tcbset{reset}
  \FloatBarrier
  \endgroup
}

\newcommand{\mymaketitle}{%
  \ifpaperinsettitle
    \myinsettitle
  \else\ifpapersegmentedtitle
    \mysegmentedtitle
  \else
  \ifpaperdarktitle
    \hypersetup{linkcolor=metatitlelink,citecolor=metatitlelink,urlcolor=metatitlelink}
  \fi
  \tcbset{enhanced,frame hidden}
  \tcbset{left=0.5cm}
  \tcbset{right=0.5cm}
  \tcbset{top=0.5cm}
  \tcbset{bottom=0.5cm}
  \tcbset{arc=10pt}
  \tcbset{colback=metabg}
  \ifpaperdarktitle
    \tcbset{arc=2pt}
  \fi
  \ifpaperroundtitle
    \tcbset{arc=10pt}
  \fi
  \ifpapergradienttitle
    \ifpapersharpgradient
      \tcbset{interior style={top color=metabg,middle color=metabg,bottom color=metabgsecond}}
    \else\ifpaperlategradient
      \tcbset{interior style={shade,shading=appleairlate}}
    \else
      \tcbset{interior style={top color=metabg,bottom color=metabgsecond}}
    \fi\fi
  \fi
  \tcbset{coltext=metatitlefg}
  \tcbset{before skip=0pt}
  \tcbset{grow to left by=1.5pt}
  \tcbset{grow to right by=1.5pt}
  \ifpapersegmentedtitle
    \tcbset{left=0pt,right=0pt,top=0pt,bottom=0pt}
  \fi
  \tcbset{overlay={
    \begin{scope}
      \clip[rounded corners=10pt]
        (frame.south west) rectangle (frame.north east);
      \path[fill=booktagbg]
        (frame.south east)
        -- ([yshift=0.92cm]frame.south east)
        -- ([xshift=-2.15cm,yshift=0.92cm]frame.south east)
        .. controls
          ([xshift=-2.31cm,yshift=0.92cm]frame.south east) and
          ([xshift=-2.38cm,yshift=0.84cm]frame.south east)
        .. ([xshift=-2.45cm,yshift=0.67cm]frame.south east)
        -- ([xshift=-2.76cm]frame.south east)
        -- cycle;
      \node[anchor=center,inner sep=0pt]
        at ([xshift=-1.12cm,yshift=0.44cm]frame.south east) {%
          \includegraphics[width=\paperlogowidth]{assets/\paperlogofile}};
    \end{scope}}}
  % 
  \begin{tcolorbox}
  \ifpapersegmentedtitle
    \noindent\hspace*{0.5cm}\begin{minipage}{\dimexpr\linewidth-1cm\relax}
      \vspace*{0.5cm}
      \setlength{\parindent}{0cm}
      \setlength{\parskip}{0.5cm}
      {
        \setlength{\parskip}{0cm}
        \raggedright
        \nohyphens
        {
          \setstretch{1.618}
          \titlelist\par
        }
        \vskip 0.2cm
        \authorlist\par
        \vskip 0.2cm
        \affiliationlist\par
        \contributionlist\par
      }
      \vskip 0.28cm
      {\color{metatitlelink!45!metabg}\hrule height 0.35pt}
      \vskip 0.28cm
      \abstractlist\par
      \vskip 0.45cm
    \end{minipage}\par
    \noindent\begin{tikzpicture}[baseline=0pt]
      \path[shade,top color=metabg,bottom color=metabgsecond]
        (0,0) rectangle (\linewidth,0.22cm);
    \end{tikzpicture}\par
    \begin{tcolorbox}[enhanced,frame hidden,boxsep=0pt,
      left=0.5cm,right=0.5cm,top=0.34cm,bottom=0.5cm,
      colback=metabgsecond,coltext=white,arc=10pt,sharp corners=north,
      grow to left by=0.35cm,grow to right by=0.35cm,
      before skip=0pt,after skip=0pt,
      overlay={\node[anchor=south east,at=(frame.south east),
        xshift=-0.5cm,yshift=0.45cm,inner sep=0pt]{%
        \includegraphics[width=\paperlogowidth]{assets/\paperlogofile}};}]
      \setlength{\parskip}{0cm}
      \hypersetup{linkcolor=white,citecolor=white,urlcolor=white}
      \ifdefempty{\metadatalist}{\vspace*{0.65cm}}{\metadatalist\par}
    \end{tcolorbox}
  \else
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
    \ifpaperdarktitle
      \vskip 0.28cm
      {\color{metatitlelink!45!metabg}\hrule height 0.35pt}
      \vskip 0.28cm
    \fi
    %
    \abstractlist\par
    %
    \vskip 0.5cm
    %
    \ifpapersharpgradient
      {\color{white!92!metabgsecond}
        \hypersetup{linkcolor=white,citecolor=white,urlcolor=white}
        \setlength{\parskip}{0cm}
        \ifdefempty{\metadatalist}{\vspace*{0.65cm}}{\metadatalist\par}}
    \else
      {
        \setlength{\parskip}{0cm}
        \ifdefempty{\metadatalist}{\vspace*{0.65cm}}{\metadatalist\par}
      }
    \fi
  \fi
  \end{tcolorbox}
  \ifpaperdarktitle
    \ifpaperfancycite
      \hypersetup{linkcolor=metablue,citecolor=metacite,urlcolor=metablue}
    \else
      \hypersetup{linkcolor=metablue,citecolor=metablue,urlcolor=metablue}
    \fi
  \fi
  \tcbset{reset}
  \FloatBarrier
  \fi\fi
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
