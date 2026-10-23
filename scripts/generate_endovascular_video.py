#!/usr/bin/env python3
"""Build a calm, child-friendly German explainer video for the catheter station."""
from PIL import Image, ImageDraw, ImageFont
import os, subprocess

W,H=1280,720
OUT="assets"
TMP="/tmp/endovascular-video"
os.makedirs(OUT,exist_ok=True); os.makedirs(TMP,exist_ok=True)
font="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
bold="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
scenes=[
("Was ist das endovaskuläre System?","Unser Körper hat ein riesiges Netz aus Blutgefäßen. Sie verbinden das Herz mit Organen und Muskeln.","Blutgefäße sind die Wege des Körpers."),
("Arterien und Venen","Blutgefäße transportieren Blut durch den Körper. Zusammen bilden sie ein verzweigtes Netzwerk – wie Straßen mit vielen Abzweigungen.","Viele kleine Wege bilden ein großes Netzwerk."),
("Was ist ein Katheter?","Ein Katheter ist ein dünner, biegsamer Schlauch. Fachleute können ihn vorsichtig durch ein Blutgefäß zu einem bestimmten Ort führen.","Ein Katheter ist dünn und biegsam."),
("Wie findet er den Weg?","Mit speziellen Bildern sehen medizinische Teams, wo sich das Instrument befindet. Sie lenken es Schritt für Schritt durch die Gefäßwege.","Bilder helfen dem Team bei der Orientierung."),
("Warum helfen Roboter?","Ein Robotersystem kann kleine, kontrollierte Bewegungen unterstützen. Das medizinische Team bleibt aufmerksam und steuert den Ablauf.","Roboter unterstützen präzise Bewegungen."),
("Klein und sorgfältig","So können Fachleute manche Stellen im Körper von innen erreichen. Das ist eine vereinfachte Erklärung – echte Behandlungen werden sorgfältig geplant.","Technik hilft – Menschen entscheiden.")
]
def F(n,b=False): return ImageFont.truetype(bold if b else font,n)
def wrap(d,txt,fo,maxw):
    lines=[]; line=""
    for word in txt.split():
        candidate=(line+" "+word).strip()
        if d.textbbox((0,0),candidate,font=fo)[2] <= maxw: line=candidate
        else:
            if line: lines.append(line)
            line=word
    if line: lines.append(line)
    return lines
def scene(i):
    im=Image.new("RGB",(W,H),(246,248,242)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((48,42,1232,678),radius=28,fill=(233,240,229),outline=(213,226,211),width=2)
    d.text((90,78),"MEDICAL ROBOTICS  /  KATHETER-STATION",font=F(20,True),fill=(45,100,83))
    d.text((90,125),scenes[i][0],font=F(40,True),fill=(18,61,60))
    y=202
    for line in wrap(d,scenes[i][1],F(27),500):
        d.text((92,y),line,font=F(27),fill=(65,102,99)); y+=42
    # Simplified torso, arteries and veins; intentionally non-graphic.
    d.ellipse((760,155,1120,560),fill=(247,232,216),outline=(230,204,184),width=3)
    d.ellipse((872,177,1008,300),fill=(239,196,166))
    d.rounded_rectangle((830,270,1050,510),radius=80,fill=(239,196,166))
    def line(points,color,width): d.line(points,fill=color,width=width,joint="curve")
    red=(202,93,94); blue=(78,135,176)
    line([(940,260),(940,320),(930,365),(940,410),(925,470)],red,18)
    line([(940,330),(880,360),(850,410)],red,12); line([(940,365),(1000,390),(1030,440)],red,12)
    line([(940,300),(900,285),(880,250)],red,10); line([(940,300),(980,285),(1000,250)],red,10)
    line([(966,265),(970,325),(965,370),(980,420),(965,475)],blue,15)
    line([(965,355),(910,390),(890,435)],blue,10); line([(965,390),(1015,415),(1020,460)],blue,10)
    path=[(940,280),(940,320),(930,365),(940,410),(925,470)]
    if i>=2:
        points=[(855,470),(890,440),(920,420),(940,410),(930,365),(940,320),(940,280)][:i+2]
        line(points,(37,90,89),7)
        px,py=path[min(i-1,4)]
        d.ellipse((px-12,py-12,px+12,py+12),fill=(217,237,156),outline=(18,61,60),width=4)
    if i>=4:
        d.rounded_rectangle((1090,365,1180,455),radius=20,fill="white",outline=(45,100,83),width=4)
        d.rounded_rectangle((1107,386,1163,416),radius=12,fill=(18,61,60))
        d.ellipse((1118,394,1128,405),fill=(217,237,156)); d.ellipse((1142,394,1152,405),fill=(217,237,156))
        d.line((1135,365,1135,347),fill=(45,100,83),width=5); d.ellipse((1128,338,1142,352),fill=(217,237,156))
    d.rounded_rectangle((90,560,1190,625),radius=16,fill="white")
    d.text((120,580),scenes[i][2],font=F(24,True),fill=(32,81,72))
    d.text((1145,640),f"{i+1:02d} / 06",font=F(16,True),fill=(79,117,101))
    return im
def run(cmd): subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
segments=[]
for i,(title, narration, takeaway) in enumerate(scenes):
    scene(i).save(f"{TMP}/scene{i}.png")
    run(["espeak","-v","de","-s","105","-a","145","-w",f"{TMP}/voice{i}.wav",narration])
    dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",f"{TMP}/voice{i}.wav"]).decode().strip())+0.6
    seg=f"{TMP}/seg{i}.mp4"; segments.append(seg)
    run(["ffmpeg","-y","-loop","1","-i",f"{TMP}/scene{i}.png","-t",str(dur),"-vf","scale=1280:720,format=yuv420p","-r","20","-c:v","libx264","-preset","ultrafast","-crf","30","-an",seg])
with open(f"{TMP}/videos.txt","w") as f:
    for p in segments: f.write(f"file '{p}'\n")
with open(f"{TMP}/audio.txt","w") as f:
    for i in range(6): f.write(f"file '{TMP}/voice{i}.wav'\n")
run(["ffmpeg","-y","-f","concat","-safe","0","-i",f"{TMP}/videos.txt","-c","copy",f"{TMP}/silent.mp4"])
run(["ffmpeg","-y","-f","concat","-safe","0","-i",f"{TMP}/audio.txt","-c:a","pcm_s16le",f"{TMP}/voice.wav"])
run(["ffmpeg","-y","-i",f"{TMP}/silent.mp4","-i",f"{TMP}/voice.wav","-c:v","libx264","-preset","medium","-crf","29","-c:a","aac","-b:a","96k","-shortest","-movflags","+faststart",f"{OUT}/endovascular-explainer-de.mp4"])
