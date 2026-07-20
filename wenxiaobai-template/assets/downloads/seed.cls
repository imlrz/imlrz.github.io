
%%======== Pckage options and base class ========
%\newboolean{logo}

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{seed}[2026/07/19 Source-faithful Seed paper base with selectable color themes]
\newcommand{\paperaccenthex}{2E5AA8}
\newcommand{\papertinthex}{E6EDFA}
\newcommand{\papersofthex}{F1F4F7}
\newcommand{\paperlinehex}{B8C4D8}
\newcommand{\paperlogofile}{wenxiaobai-icon-black.png}
\DeclareOption{ustc}{%
  \renewcommand{\paperaccenthex}{2E5AA8}%
  \renewcommand{\papertinthex}{E6EDFA}%
  \renewcommand{\papersofthex}{F1F4F7}%
  \renewcommand{\paperlinehex}{B8C4D8}%
  \renewcommand{\paperlogofile}{wenxiaobai-icon-black.png}}
\DeclareOption{indigo}{%
  \renewcommand{\paperaccenthex}{514AA3}%
  \renewcommand{\papertinthex}{ECEAF8}%
  \renewcommand{\papersofthex}{F5F3FA}%
  \renewcommand{\paperlinehex}{C9C3E5}%
  \renewcommand{\paperlogofile}{wenxiaobai-icon-indigo.png}}
\DeclareOption{jade}{%
  \renewcommand{\paperaccenthex}{0B7A68}%
  \renewcommand{\papertinthex}{E3F1ED}%
  \renewcommand{\papersofthex}{F1F7F5}%
  \renewcommand{\paperlinehex}{AFD1C8}%
  \renewcommand{\paperlogofile}{wenxiaobai-icon-jade.png}}
\DeclareOption{wine}{%
  \renewcommand{\paperaccenthex}{8A3048}%
  \renewcommand{\papertinthex}{F4E7EB}%
  \renewcommand{\papersofthex}{F8F2F4}%
  \renewcommand{\paperlinehex}{DAB9C3}%
  \renewcommand{\paperlogofile}{wenxiaobai-icon-wine.png}}
\DeclareOption{amber}{%
  \renewcommand{\paperaccenthex}{A56510}%
  \renewcommand{\papertinthex}{F7EDDC}%
  \renewcommand{\papersofthex}{F9F5EC}%
  \renewcommand{\paperlinehex}{DCC7A2}%
  \renewcommand{\paperlogofile}{wenxiaobai-icon-amber.png}}
\DeclareOption{graphite}{%
  \renewcommand{\paperaccenthex}{343B45}%
  \renewcommand{\papertinthex}{E9ECEF}%
  \renewcommand{\papersofthex}{F2F3F5}%
  \renewcommand{\paperlinehex}{C5CBD1}%
  \renewcommand{\paperlogofile}{wenxiaobai-icon-graphite.png}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ExecuteOptions{ustc}
\ProcessOptions\relax
\LoadClass{article}
\pdfoutput=1

% Layout 
\RequirePackage[top=2.75cm, bottom=2.5cm, left=2.5cm, right=2.5cm, columnsep=0.65cm]{geometry}
\RequirePackage{microtype}
\RequirePackage{placeins}
\RequirePackage{hyphenat}
\RequirePackage{setspace}
\RequirePackage{parskip}
\RequirePackage[latin, english]{babel}
\RequirePackage{lipsum}
\RequirePackage{etoolbox}
\RequirePackage{fancyhdr}  % custom headers/footers
\RequirePackage{ulem}  % 引用下划线
\DisableLigatures[f]{family=sf*} 
\RequirePackage{graphicx}
\RequirePackage{subcaption}


\RequirePackage{booktabs}
\RequirePackage{nicematrix}
\RequirePackage{multirow}
\RequirePackage{bm}
\newcommand{\nm}[1]{#1}
\RequirePackage[most]{tcolorbox}
\RequirePackage{xcolor}
\definecolor{seedbg}{HTML}{\paperaccenthex}
\definecolor{seedblue}{HTML}{\paperaccenthex}
\definecolor{brandblue}{HTML}{\paperaccenthex}
\definecolor{brandbg}{HTML}{\papertinthex}
\definecolor{brandsoft}{HTML}{\papersofthex}
\definecolor{brandline}{HTML}{\paperlinehex}
\newcommand{\seedblue}[1]{{\bfseries\color{seedblue} #1}} 

% References %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{hyperref}
\RequirePackage[noabbrev,nameinlink]{cleveref}
\hypersetup{
  colorlinks,
  linkcolor=seedblue,
  citecolor=seedblue,
  urlcolor=seedblue
}



\RequirePackage[numbers, sort&compress]{natbib}
%\RequirePackage[round,authoryear]{natbib}
\def\bibfont{\small}

%%========  Bibliography using bibtex ========
\addto{\captionsenglish}{\renewcommand{\refname}{References}}
\newcommand{\citeas}[1]{\Needspace*{8\baselineskip}\noindent\bibentry{#1}}



% Section and caption format 
\newcommand{\sectionfont}
{\fontsize{12}{10}\selectfont} 

\newcommand{\subsectionfont}
{\fontsize{11}{10}\selectfont} 

\RequirePackage{titlesec}
\titleformat*{\paragraph}{\itshape}
\titleformat*{\section}{\sectionfont\sffamily\bfseries\seedblue}
\titleformat*{\subsection}{\subsectionfont\sffamily\bfseries\seedblue}


%一级二级三级标题用12 11 10
\titleformat*{\subsubsection}{\normalsize\sffamily\bfseries\seedblue}


\newcommand{\bffont}
{\fontsize{8.8}{10}\selectfont} 

\DeclareTextFontCommand{\textbf}{\bffont\bfseries\sffamily}



\RequirePackage{caption}
\DeclareCaptionLabelSeparator{custom}{}
\DeclareCaptionFormat{custom}{{\sffamily\textbf{#1 #2}} #3}
\captionsetup{singlelinecheck=true,format=custom,labelsep=custom,font=small}
\captionsetup[sub]{singlelinecheck=true,format=custom,labelsep=custom,font=small}


\RequirePackage[T1]{fontenc}
\DeclareFontFamily{T1}{bytesans}{}
\DeclareFontShape{T1}{bytesans}{m}{n}{<-> s * [1] assets/bytesans}{}
\DeclareFontShape{T1}{bytesans}{b}{n}{<-> s * [1] assets/bytesans}{}
\pdfmapline{+bytesans < assets/ByteSans-Bold.ttf <T1-WGL4.enc}
\renewcommand{\sfdefault}{bytesans}%


\DeclareFontFamily{T1}{bytesansmedium}{}
\DeclareFontShape{T1}{bytesansmedium}{m}{n}{<-> s*[1] assets/bytesansmedium}{}
\pdfmapline{+bytesansmedium < assets/ByteSans-Medium.ttf <T1-WGL4.enc}
%\renewcommand{\sfdefault}{bytesansmedium}%
\renewcommand{\rmdefault}{cmr}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Authors, affiliations, infos %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\renewcommand\addtolist[5][]{
  \begingroup
    \if\relax#3\relax\def\sep{}\else\def\sep{#5}\fi
    \let\protect\@unexpandable@protect 
    \xdef#3{\expandafter{#3}\sep #4[#1]{#2}}%
  \endgroup
}

\newcommand{\authorfont}
{\fontsize{12}{14}\selectfont} 

\newcommand\authorlist{}
\newcommand\authorformat[2][]{\authorfont {\sffamily #2$^{#1}$}}
\renewcommand\author[2][]{\addtolist[#1]{#2}{\authorlist}{\authorformat}{, }}

%给affiliation换成medium字体

\newcommand{\affiliationfont}
{\fontsize{10}{12}\selectfont}

\newcommand\affiliationlist{}
\newcommand\affiliationformat[2][]{{\affiliationfont {\fontfamily{bytesansmedium}\selectfont $^{#1}$#2}}}
\newcommand\affiliation[2][]{\addtolist[#1]{#2}{\affiliationlist}{\affiliationformat}{, }}

\newcommand{\contributionfont}
{\fontsize{10}{12}\selectfont}

\newcommand\contributionlist{}
\newcommand\contributionformat[2][]{{\contributionfont $^{#1}$#2}}
\newcommand\contribution[2][]{\addtolist[#1]{#2}{\contributionlist}{\contributionformat}{, }}

\newcommand{\checkdatafont}
{\fontsize{7.92}{10}\selectfont}

\newcommand\checkdatalist{}
\newcommand\checkdataformat[2][]{{\small {\checkdatafont\sffamily \bfseries #1:} #2}}
\newcommand\checkdata[2][]{\addtolist[#1]{#2}{\checkdatalist}{\checkdataformat}{\par}}


\newcommand{\abstractinfont}
{\fontsize{10}{12}\selectfont} 

\renewcommand{\abstract}[1]{\def\abstractlist{{\abstractinfont #1}}}
\newcommand{\email}[1]{\href{mailto:#1}{\texttt{#1}}}

\renewcommand\date[1]{\checkdata[Date]{#1}}
\newcommand\correspondence[1]{\checkdata[Correspondence]{#1}}


\newcommand{\titlefont}
{\fontsize{17}{20}\selectfont} 

\renewcommand{\title}[1]{\newcommand{\titlelist}{\titlefont{\sffamily #1}}}


\newcommand{\abstractfont}
{\fontsize{12}{12}\selectfont} 

\newcommand{\beginabstract}{\abstractfont{\sffamily\bfseries \seedblue{Abstract}\par}}

\newcommand{\beginappendix}{\appendix{\titlefont\sffamily \seedblue{Appendix}\par}}


\usepackage[subfigure]{tocloft}
\renewcommand{\cftsecleader}{\cftdotfill{\cftdotsep}} % 目录后一行连续的点
\renewcommand{\cftsecfont}{\sffamily}
%\renewcommand{\cftsubsecfont}{\sffamily\large}
\renewcommand{\cftsecpagefont}{\sffamily}{\color{seedblue}}
\renewcommand{\cfttoctitlefont}
{\sffamily\sectionfont\seedblue}


%%======== Header and Footer Content ========
% \fancypagestyle{firststyle}{
%     \fancyhead[R]{
%     \vskip 3mm
%       \includegraphics[width=14.5mm,height=12.3mm]{seed/white.png} 
%     }
%     \fancyhead[L]{
%         \vskip -8mm
%     \includegraphics[width=75mm,height=15mm]{seed/ustc.png}  
%     } 
% }
\fancypagestyle{firststyle}{
    \fancyhead[L]{
        \vskip -8mm
        % 只设置宽度，高度自动自适应
        \includegraphics[height=15mm]{assets/ustc_super.jpg}  
    }
    \fancyhead[R]{
        % \vskip -1mm
        % 只设置宽度，高度自动自适应
        \includegraphics[height=13.5mm]{assets/\paperlogofile}  
    }
}

%去除页眉页脚横线
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}



% rules for title box at top of first page
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%此处为标题两侧线段，0.5pt 长160mm
\newcommand{\@toptitlebar}{
  \seedblue{\hrule height 0.5pt }
  \vskip 6mm
  %\vskip -\parskip%
}
\newcommand{\@bottomtitlebar}{
  \vskip 6mm
  %\vskip -\parskip
  \seedblue{\hrule height 0.5pt}
  %\vskip 0.09in%
}


% Titlebox %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


\newcommand{\mymaketitle}{%
  %\tcbset{enhanced,frame hidden}
  \tcbset{enhanced}
  \tcbset{left=8mm}
  \tcbset{right=8mm}
  \tcbset{top=6mm}
  \tcbset{bottom=6mm}
  \tcbset{colback=white}  
   % 框线颜色
  \tcbset{colframe=seedbg} 
  % 调整框线粗细
  \tcbset{boxrule=0.5pt} 
  \tcbset{before skip=0pt}
  \tcbset{grow to left by=1.5pt}
  \tcbset{grow to right by=1.5pt}
  \tcbset{arc=2.5mm}
      {
      \setlength{\parskip}{0mm}
      \centering
      \nohyphens
      %
      
      {
      \@toptitlebar
        
        \titlelist\par
         \@bottomtitlebar
      }
      \vskip 6mm
      \authorlist
      \vskip 3mm
      %
      \affiliationlist\par
      \vskip 3mm
      %
      \contributionlist\par
    }
   \vskip 6mm   
   
  \begin{tcolorbox}
    \setlength{\parindent}{0cm}
    \setlength{\parskip}{0cm}

    %
    
    \begin{center}
        \beginabstract
        \vskip 3mm
    \end{center}
    
    \abstractlist\par
    %
    \vskip 3mm
    %
    {
      \setlength{\parskip}{0cm}
      \ifdefempty{\checkdatalist}{\vspace*{0.65cm}}{\checkdatalist\par}
    }
  \end{tcolorbox}
  \tcbset{reset}
  \FloatBarrier

  %加入页眉页脚
  \thispagestyle{firststyle}

}


\if@twocolumn%
\renewcommand{\maketitle}{
\twocolumn[%
 \vskip 3mm
  \mymaketitle
  \vskip 8mm
]
}%
\else%
\renewcommand{\maketitle}{
  \mymaketitle
  \vskip 8mm
  %\setlength{\parskip}{4mm}
}%
\fi
