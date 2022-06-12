
export const liq = `
<h3>Our Bestsellers</h3>
<div style = "display:flex;justify-content:space-around;">
  
  {% for field in shop.metafields.inventer %}
       
       {% assign title = field | last | split: "," %}
       {% assign col = title[4] %}
    
    <div style = "display:flex;flex-direction:column;" class = "grid-item-{{col}}"> 
     
        <img src = "{{title[0]}}" width = "600" height = "400" style = "width:100%;height:200px;" />
    
         <h3 style = "font-size:15px;margin-block-end:7px;margin-block-start:7px;">{{title[3]}}</h3>
         <h3 style = "margin-block-end:0px;margin-block-start:0px;font-weight:700;text-transform:uppercase;font-size:12px">{{title[2]}}</h3>
         <h2 style = "margin-top:2px;"> £{{title[6]}}</h2>
     </div>  
       {% comment %}  {% for t in title %}
        <h1>{{t}}</h1> <p>break<p>
         {% endfor %}
        {% endcomment %}
    
       
{% endfor %}
  </div>
`