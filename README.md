# Tilted Page Scroll Fork
Create a beautiful 3D tilted scrolling effect for your website.

Created by [Pete R.](http://www.thepetedesign.com), Founder of [Travelistly](http://www.Travelistly.com) and [BucketListly](http://www.bucketlistly.com)
Vanilla JS fork by [James Tyler Patton](https://jamestylerpatton.com).

## Basic Usage

With this plugin, you can create a beautiful scrolling effect and turn a simple layout website into something surprising.

First lay out your HTML markup as follows:


````html
<div class="main">
  <section class="page1">
    ...
  </section>
  <section class="page2">
    ...
  </section>
  ...
  <section class="last-page">
    ...
  </section>
</div>
````

That's it for the HTML part. Isn't that easy? Now, you can just call the function like this, and watch the magic happens:

````javascript
  // $(".main").tiltedpage_scroll({});

  new TiltedPage({
    selector: '.main',
    sectionContainer: "> section",     // In case you don't want to use <section> tag, you can define your won CSS selector here
    angle: 50,                         // You can define the angle of the tilted section here. Change this to false if you want to disable the tilted effect. The default value is 50 degrees.
    opacity: true,                     // You can toggle the opacity effect with this option. The default value is true
    scale: true,                       // You can toggle the scaling effect here as well. The default value is true.
    outAnimation: true                 // In case you do not want the out animation, you can toggle this to false. The defaul value is true.
  });
````
