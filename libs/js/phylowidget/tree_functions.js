	function draw_circles(args){
		var nodeEnter = args.nodeEnter;
		var circles = nodeEnter.append("svg:circle")
          .attr("r", function(d){ return d.children ? circle_size : 0; })
          .attr("fill", function(d){return d.duplication == "Y"? "red":"green"})
          .on("click", click)
          //.on("click", get_all_children)
          //.on("click", color_subtree)
          .on("contextmenu", function(data, index) {
                d3.select('#my_custom_menu')
                  .style('position', 'absolute')
                  .style('left', d3.event.x + "px")
                  .style('top', d3.event.y + "px")
                  .style('display', 'block');
            d3.event.preventDefault();
	    });
		return circles;	
	}

	function draw_nodes(args){
		var nodeEnter = args.nodeEnter;
		var node = args.node;
	// Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1)
          .select("circle");
          
        node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
          .style("opacity", 1);
        
    
        node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .style("opacity", 1e-6)
          .remove();
	
	}
	
	function draw_taxon_names(args){
			var nodeEnter = args.nodeEnter;
			var show_taxa = args.show_taxa;

	 		var texts = nodeEnter.append("svg:text")
            .attr("x", function(d) { return d.children ? -5 : 25; })
            .attr("y", function(d) { return d.children ? -5 : 3; })
            //.attr("class","innerNode_label")
            .attr("text-anchor", function(d){ return d.children ? "end" : "start";})
            .attr("class",function(d){ 
                if(d.children){ return "innerNode_label"}
                else{ return "leaf_label"}
            })
            .text(function(d) { 
                        if(d.children){
                            if(show_taxa.hasOwnProperty(d.name)){
                                if(d.duplication == "Y"){return "";}
                                else{return d.name;}
                            }
                        }
                        else{return d.taxon; }})
                        .on('mouseover', function(d, i){
                            d3.select(this).select("circle").classed("hover", true);
                        })
                        .on('mouseout', function(d, i){
                            d3.select(this).select("circle").classed("hover", false);
                        })
                        .on('click', show_orthologs);
                        
		return texts;                        
	}

	function draw_bootstraps(args){
		 	var nodeEnter = args.nodeEnter;
			var show_taxa = args.show_taxa;
			var visibility = args.visibility;

	 		var texts = nodeEnter.append("svg:text")
            .attr("x", function(d) { if(d.children){return -5; }})
            .attr("y", function(d) { if(d.children){return -12; }})
            .attr("text-anchor", function(d){ return d.children ? "end" : "start";})
            .attr("class",function(d){ if(d.children){ return "bootstrap"; }})
            .attr("visibility",visibility)
            .text(function(d) { 
                        if(d.children){
                           return d.bootstrap;
                        }
                });
                        
		return texts;                      
	}
	
    function set_links(args){
		var link = args.link;
		var link_type = args.link_type;
		var node_thickness = args.node_thickness;
		link_type = "elbow";
      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("stroke-width", function(d){
              //console.log("drawing line with thickness "+node_thickness);
                return node_thickness;
          })
          .attr("stroke", function(d){
              
              return "black";
                //return taxon_colors.hasOwnProperty(d.name)? taxon_colors[d.name]: "black";
          })      
          .attr("d", elbow)
          //.attr("d", diagonal)
         //.attr("d", function(d) {
            //   var o = {x: source.x0, y: source.y0};
         //      return diagonal({source: o, target: o});
         //})
        .transition()
          .duration(duration)
          .attr("d", elbow)
          //.attr("d", diagonal)
          ;
    
      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", elbow)
          //.attr("d", diagonal)
          ;
    
      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", elbow)
          //.attr("d", diagonal)
          //.attr("d", function(d) {
             //   var o = {x: source.x, y: source.y};
            //    return diagonal({source: o, target: o});
          //})
          .remove();
    }
    

	// Domains 
    function draw_sequences(args){
    	var leaf_group_x = args.leaf_group_x;
    	var sequence_start_y = args.sequence_start_y;
    	var nodeEnter = args.nodeEnter;
    	var domainScale = args.domainScale;
		var visibility = args.visibility;

    	var rects = nodeEnter.filter(function(d){ return d.type == "leaf"});
                rects.append("rect")
                .attr("x", leaf_group_x +8)
                .attr("y", sequence_start_y)
                .attr("class", "seq_string")
				.attr("visibility",visibility)
                .attr("width", function(d){return d.children ? "":"5";})
                .attr("height", function(d){
                        if(!d.children){
                                        //console.log("draw sequence from "+sequence_start_y+" to "+(sequence_start_y + sequenceScale(d.seq_length))+"("+d.seq_length+")");
                                        //console.log("transform "+d.seq_length+" to "+sequenceScale(d.seq_length)+" (start drawing at: "+sequence_start_y+")");
                        }
                       return d.children ? "": domainScale(d.seq_length);
                })
               .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
               .attr("fill", 
               "url(#line_gradient)");
            //   function(d){return d.children ? "":"grey";});

		return rects;
    }
	function draw_domains(args){
		var domains = args.domains;
		var sequence_start_y = args.sequence_start_y;
		var domainScale = args.domainScale;
		var sequence_rect_width = args.sequence_rect_width;
		var visibility = args.visibility;
		var all_domains =  domains.enter().append("rect")
                       .attr("x", leaf_group_x + 4)
                       .attr("y", function(d){
                                   //console.log("draw domain from "+sequence_start_y+" to "+(sequence_start_y + domainOnlyScale(d.domain_start))+"("+d.domain_start+")");
                                   return sequence_start_y + domainScale(d.domain_start);
                           })
                       .attr("class", "domain")
						.attr("visibility",visibility)
                       .attr("rx", 5)
                       .attr("ry", 5)
                       .attr("transform", "matrix(1,0,0,1,100,0)")
                       .attr("stroke", "none")
                       .attr("width", function(d){return sequence_rect_width;})
                       .attr("height", function(d){
                               var length = domainScale(d.domain_stop - d.domain_start);
                                   //console.log("sequence_rect: appending source is "+d.x);
                                //console.log("transform domain length "+(d.domain_stop - d.domain_start)+" to "+length);
                               return length;
                        })
                        .attr("transform", "rotate(-90 100 100)")
                        .attr("fill", 
//                        "url(#domain_gradient)")
//                        ;
                        function(d,i){
                        //console.log("checking for "+d.name+" in domain2color");
//                                if( d.name in domain2color ) {
                                if( domain2color[d.name] === undefined ) {
                                    //console.log("not found");
                                    domain2color[d.name] = domain_colors[i];
                                    //console.log("will use: "+domain_colors[i]);
                                    return "url(#"+domain_colors[i]+")";
                                }
                                else{
                                    //console.log("found! using "+domain2color[d.name]);
                                    return "url(#"+domain2color[d.name]+")";
                                }
    //                            return "url(#"+domain_colors[i]+")";
                        });          
		return all_domains;
 }
	// Conservation 
    function draw_aligned_sequences(args){
    
    	var leaf_group_x = args.leaf_group_x;
    	var sequence_start_y = args.sequence_start_y;
    	var nodeEnter = args.nodeEnter;
    	var domainScale = args.domainScale;
		var visibility = args.visibility;
    	var rects = nodeEnter.filter(function(d){ return d.type == "leaf"});
                rects.append("rect")
                .attr("x", leaf_group_x +8)
                .attr("y", sequence_start_y)
                .attr("class", "aligned_seq_string")
				.attr("visibility",visibility)
                .attr("width", function(d){return d.children ? "":"10";})
                .attr("height", function(d){
                        if(!d.children){
                                        //console.log("draw sequence from "+sequence_start_y+" to "+(sequence_start_y + sequenceScale(d.seq_length))+"("+d.seq_length+")");
                                        //console.log("transform "+d.seq_length+" to "+sequenceScale(d.seq_length)+" (start drawing at: "+sequence_start_y+")");
                        }
                       return d.children ? "": domainScale(4000);
                       return d.children ? "": domainScale(d.seq_length);
                })
               .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
               .attr("fill", 
               "green");
            //   function(d){return d.children ? "":"grey";});

		return rects;
    }   
	function draw_gaps(args){
		var gaps = args.gaps;
		var sequence_start_y = args.sequence_start_y;
		var domainScale = args.domainScale;
		var sequence_rect_width = args.sequence_rect_width;
		var visibility = args.visibility;
		var all_gaps =  gaps.enter().append("rect")
                       .attr("x", leaf_group_x + 9)
                       .attr("y", function(d){
                                   //console.log("draw domain from "+sequence_start_y+" to "+(sequence_start_y + domainOnlyScale(d.domain_start))+"("+d.domain_start+")");
                                   return sequence_start_y + domainScale(d.domain_start);
                           })
                       .attr("class", "gap")
					   .attr("visibility",visibility)
                       //.attr("rx", 5)
                       //.attr("ry", 5)
                       //.attr("transform", "matrix(1,0,0,1,100,0)")
                       //.attr("stroke", "none")
                       .attr("width", function(d){return sequence_rect_width - 4;})
                       .attr("height", function(d){
                               var length = domainScale(d.domain_stop - d.domain_start);
                                   //console.log("sequence_rect: appending source is "+d.x);
                                //console.log("transform domain length "+(d.domain_stop - d.domain_start)+" to "+length);
                               return length;
                        })
                        .attr("transform", "rotate(-90 100 100)")
                        .attr("fill", "white");
		return all_gaps;
 }
	// Synteny
    function draw_synteny_seqs(args){
    
    	var leaf_group_x = args.leaf_group_x;
    	var sequence_start_y = args.sequence_start_y;
    	var nodeEnter = args.nodeEnter;
    	var domainScale = args.domainScale;
		var visibility = args.visibility;

    	var synteny_rects = nodeEnter.filter(function(d){ return d.type == "leaf"});
                synteny_rects.append("rect")
                .attr("x", leaf_group_x +11)
                .attr("y", sequence_start_y)
                .attr("class", "synteny_seq_string")
				.attr("visibility",visibility)
                .attr("width", function(d){return d.children ? "":"2";})
                .attr("height", function(d){
                        if(!d.children){
                                        //console.log("draw sequence from "+sequence_start_y+" to "+(sequence_start_y + sequenceScale(d.seq_length))+"("+d.seq_length+")");
                                        //console.log("transform "+d.seq_length+" to "+sequenceScale(d.seq_length)+" (start drawing at: "+sequence_start_y+")");
                        }
                       return d.children ? "": domainScale(4000);
                       return d.children ? "": domainScale(d.seq_length);
                })
               .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
               .attr("fill", "grey");
            //   function(d){return d.children ? "":"grey";});

		return synteny_rects;
    }   
	function draw_synteny(args){
		var syntenties = args.syntenties;
		var sequence_start_y = args.sequence_start_y;
		var domainScale = args.domainScale;
		var sequence_rect_width = args.sequence_rect_width;
		var visibility = args.visibility;

		var all_syntenies =  syntenties.enter().append("rect")
                       .attr("x", leaf_group_x + 6)
                       .attr("y", function(d){
                                   //console.log("draw domain from "+sequence_start_y+" to "+(sequence_start_y + domainOnlyScale(d.domain_start))+"("+d.domain_start+")");
                                   return sequence_start_y + domainScale(d.length);
                        })
                       .attr("class", "synteny")
					   .attr("visibility",visibility)
                       //.attr("rx", 5)
                       //.attr("ry", 5)
                       //.attr("transform", "matrix(1,0,0,1,100,0)")
                       //.attr("stroke", "none")
                       .attr("width", function(d){return sequence_rect_width;})
                       .attr("height", function(d){
                               var length = domainScale(d.length);
                                   //console.log("sequence_rect: appending source is "+d.x);
                                //console.log("transform domain length "+(d.domain_stop - d.domain_start)+" to "+length);
                               return length;
                        })
                        .attr("transform", "rotate(-90 100 100)")
                        .attr("fill", "green");
		return all_syntenies;
 	}
	// Images    
    function draw_images(args){
     	var nodeEnter = args.nodeEnter;
     	var image_path = args.image_path;
     	
     	var images = nodeEnter.append("svg:image")
            .attr("y", -10)
            //.attr("x", 12.5)
            .attr("text-anchor", function(d){ return  "end";})
            .attr("width", 20).attr("height", 20)
            //.attr("xlink:href", function(d) { return d.children == null? image_path+"/thumb_"+d.taxon+".png" : "";  });
        .attr("xlink:href", function(d) { return d.children == null? image_path+"/thumb_"+d.taxon+".png" : "";  });
    }
	// ToolTip
	function add_tipsy(args){
		var where = args.where;
		jQuery(where).tipsy({ 
        gravity: 'se', 
        html: true, 
        title: function() {
           var c = "red";
           var e = this.__data__;
           var length = e.domain_stop - e.domain_start;
          return 'Domain: '+e.name+'<br>Length: '+length+" AA<br> E-value: "+e.evalue+"<br>Start: "+e.domain_start+" End: "+e.domain_stop; 
        }
      });
	
	}
    function toggleAll(d) {
        if (d.children) {
          d.children.forEach(toggleAll);
          click(d);
        }
      }
      
    // Internal text
    function hide_internal_text(d) {
         d3.select("#tree svg").selectAll(".innerNode_label").text(function(d){
                return d.children ? "": d.taxon; 
        });
    }
    function show_internal_text(d) {
        //console.log("we are here");
         d3.select("#tree svg").selectAll(".innerNode_label").text(function(d) { 
        if(d.duplication == "Y"){
                return "";
        }
        else{
                    return d.children ? d.name:d.taxon; 
        }
        });
    }
    
    function show_internal_text_important(d) {
         d3.select("#tree svg").selectAll(".innerNode_label").text(function(d) { 
            if(d.children){
                if(show_taxa.hasOwnProperty(d.name)){
                    if(d.duplication == "Y"){
                        return "";
                    }
                else{
                    return d.name;
                }
            }
        }
        else{
            return d.taxon; 
        }
        });
    }
    
    
    // IDS
    function show_leaf_ids(d) {
         d3.select("#tree svg").selectAll(".leaf_label").text(function(d) { 
            return  d.name; 
        });
    }
	function show_leaf_taxa(d) {
         d3.select("#tree svg").selectAll(".leaf_label").text(function(d) { 
            return d.children ? d.name:d.taxon; 
        });
    }
    
// Domains
    function hide_domains(d) {
         d3.select("#tree svg").selectAll(".domain").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".seq_string").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "hidden");
    }
    function show_domains(d) {
    	hide_conservation();
    	hide_synteny();
         d3.select("#tree svg").selectAll(".domain").attr("visibility", "");
         d3.select("#tree svg").selectAll(".seq_string").attr("visibility", "");
         d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "");
    }
    
// Conservation
    function hide_conservation(d) {
         d3.select("#tree svg").selectAll(".gap").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".aligned_seq_string").attr("visibility", "hidden");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "hidden");
    }
    function show_conservation(d) {
	    hide_domains();
	    hide_synteny();
         d3.select("#tree svg").selectAll(".gap").attr("visibility", "");
         d3.select("#tree svg").selectAll(".aligned_seq_string").attr("visibility", "");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "");
    }

// Gene neighborhood
    function hide_synteny(d) {
         d3.select("#tree svg").selectAll(".synteny").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".synteny_seq_string").attr("visibility", "hidden");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "hidden");
    }
    function show_synteny(d) {
	    hide_domains();
	    hide_conservation();
         d3.select("#tree svg").selectAll(".synteny").attr("visibility", "");
         d3.select("#tree svg").selectAll(".synteny_seq_string").attr("visibility", "");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "");
    }


// Bootstrap
	function show_bootstrap(d){
		d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "");
	}
	function hide_bootstrap(d){
		d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "hidden");
	}
    
// Images
    function hide_images(d) {
         d3.select("#tree svg").selectAll("image").attr("visibility", "hidden");
    }
    function show_images(d) {
         d3.select("#tree svg").selectAll("image").attr("visibility", "");
    }
// evolutionary events
    function hide_evol_nodes(d) {
        d3.select("#tree svg").selectAll("circle").attr("fill", "black");
    }
    function show_evol_nodes(d) {
        d3.select("#tree svg").selectAll("image").attr("visibility", "");
        d3.select("#tree svg").selectAll("circle")
        //.attr("r", function(d){
        //        if(d.children){
        //            return d.duplication == "Y"? 10:5;
        //        }
        //})
        .attr("fill", function(d){return d.duplication == "Y"? "red":"green"})
        .on("click", click);
    }    
// Taxon colors
    function show_taxon_colors(d){
         d3.select("#tree svg").selectAll(".tax_color").attr("visibility", "");
    }
    function hide_taxon_colors(d){
        d3.select("#tree svg").selectAll(".tax_color").attr("visibility", "hidden");
    }

// For lines between nodes
    function elbow(d, i) {
        //    console.log("use M" + d.source.y + "," + d.source.x
        //   + "H" + d.target.y + "V" + d.target.x
        //   + (d.target.children ? "" : "h" + margin.right));
           
           return "M" + d.source.y + "," + d.source.x
      + "V" + d.target.x + "H" + d.target.y;
//      return "M" + d.source.y + "," + d.source.x
//           + "H" + d.target.y + "V" + d.target.x
//           + (d.target.children ? "" : "h" + margin.right);
    }
    
    function redraw() {
      //console.log("here", d3.event.translate, d3.event.scale);
          vis.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
    }

// Toggle children on click.


    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      
      //console.log("clicked on "+d.name);
      //console.log(d);
      d3.select(this).text("hahaha");
      console.log("this node data: "+this.parentNode.__data__ );
      var dad = this.parentNode;
      d3.select(this).select("text").text(function(d){
          //console.log("trying to select: "+d.name)
          return "hahhaaa";
      });
      // update node
        d3.select(this)
        .append("svg:path")
        .attr("d", function(d){
                var x = 200, y = 100;
                return 'M ' + x +' '+ y + ' l 4 4 l -8 0 z';
                })
//        d3.svg.symbol())
        
        
            .attr("r",function(d){return d.duplication == "Y"? duplication_circle_size:circle_size;})
            .attr("class", "collapsed")    
            .attr("fill",function(d){return d.children? "":"white";})
            .attr("stroke",function(d){return d.children? "":"black";})
            .attr("stroke-width", function(d){return d.children? "":"2.5px";})
;
      
      
      
      update(d);
    }
  
    function collapse(d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
            }
          }
    
    
    function show_orthologs(d){
       // Walk parent chain
            var ancestors = [];
            var parent = d;
            while (!_.isUndefined(parent) && parent.duplication != "Y") {
                ancestors.push(parent);
                parent = parent.parent;
            }
            // console.log(parent);
//             console.log("(before: Found "+ancestors.length+" ancestors");
//             ancestors = ancestors.slice(0,ancestors.length -1);
//             console.log("(sliced: "+ancestors.length+" ancestors");
//             console.log(ancestors);
//             console.log("getting children for "+parent.name+"");
// 
//             var additional_children = get_all_children(parent);
//             if(additional_children != null){
//                 console.log("(from children: Found "+additional_children.length+" children");
//                 additional_children.forEach(function(node){
//                     console.log(node);
//                     ancestors.push(node);
//                 })
//             }
            // ok, we now have all parents, but lets now collect all children
            //while (!_.isUndefined(parent.children)) {
            //    parent.children.forEach(function(d) {
            //        while (!_.isUndefined(d.children)) {
            //    }
            //    ancestors.push(parent.children)
                
            //}
            //console.log("(after: Found "+ancestors.length+" ancestors");
            
            // Get the matched links
            var matchedLinks = [];
            d3.selectAll('path.link')
                .filter(function(d, i)
                {
                    return _.any(ancestors, function(p)
                    {
                        return p === d.target;
                    });
                })
                .each(function(d)
                {
                    matchedLinks.push(d);
                });
             //console.log("found "+matchedLinks.length+" links");           
             //console.log("found "+ancestors.length+" ancestors");           
     
             
             animateParentChain(matchedLinks, ancestors);
            //matchedLinks.attr("stroke-width", "2.5px");
    }
    
    function animateParentChain(links, nodes){

                //console.log(nodes);
                    d3.selectAll("circle")
                    .data(nodes)
                    .enter().append("svg:circle")
                    .attr("r", function(d){ return d.children ? circle_size : 0; })
                    .attr("fill", "orange");
            
                var linkRenderer = d3.svg.diagonal()
                    .projection(function(d)
                    {
                        return [d.y, d.x];
                    });
            
                // Links
                ui.animGroup.selectAll("path.selected")
                    .data([])
                    .exit().remove();
            
                //console.log("removed previous links");
            
                ui.animGroup
                    .selectAll("path.selected")
                    .data(links)
                    .enter().append("svg:path")
                    .attr("class", "selected link")
                    .attr("d", elbow);
        
//           .attr("stroke-width", function(d){
//                 return "3.5px";
//           })
//           .attr("stroke", function(d){
//               //console.log("has property for "+d.source.name);
//               return "black";
//                 //return taxon_colors.hasOwnProperty(d.name)? taxon_colors[d.name]: "black";
//           })      
//           .attr("d", elbow)
        
        

    //console.log("selected new links");

    // Animate the clipping path
    var overlayBox = ui.svgRoot.node().getBBox();
    //console.log("initiated overlay box");

    ui.svgRoot.select("#clip-rect")
        .attr("x", overlayBox.x + overlayBox.width)
        .attr("y", overlayBox.y)
        .attr("width", 0)
        .attr("height", overlayBox.height)
        .transition().duration(500)
        .attr("x", overlayBox.x)
        .attr("width", overlayBox.width);
        //console.log("attached animation");

}
    
    
    function show_tax_group(d){
        // have predefined set of inner nodes
        // iterate over those nodes and find them in the tree
        for(var taxon in show_taxa){
            console.log("ok, collect them all for "+taxon);
            var chosen_nodes = d3.select("#tree svg").selectAll("[name=Eutheria]");
                console.log(chosen_nodes);
                chosen_nodes.each(function(chosen_node){
                        var collected_nodes = get_all_children(chosen_node);
                        if(collected_nodes != null){
                            console.log("end, collected: "+collected_nodes.length+" elements");
                        }
                })
                //console.log("well, we return after the first one");
                        return;
            
        }
        // get all children for 
    }
    
    function get_all_children(d){
        var all_children = new Array;
        //return ;
        all_children = get_all_childs(d);
        if(all_children != null){
            console.log("end, our array has: "+all_children.length+" elements");
            all_children.forEach(function(elem){
                console.log(elem);
            });
        }
        else{
            console.log("Could not find children");
        }
        return all_children;
    }
    
    function get_all_childs(d){
        var temp_array  = new Array;
        console.log("in the get_all_childs for "+d.name+" with id: "+d.id);
        if(d.children){
                var children = d.children;
                for (var i = 0; i < children.length; i++) {
                    var temp_array_child = new Array;
                    if(temp_array_child != null){
                        temp_array_child = get_all_childs(children[i]);
                        console.log("got from child: : "+temp_array_child.length+" children");
                        temp_array_child.forEach(function(elem){
                            console.log(elem);
                            temp_array.push(elem);
                        })
                    }
                    //temp_array.push(temp_array_child);
                }
                temp_array.push(d);
        }
        else{
            console.log("well, this is a child, return its name: "+d);
            temp_array.push(d);
            return temp_array;
        }
        return temp_array;
    }
    
    function submit_download_form(output_format){
	// Get the d3js SVG element
	var tmp = document.getElementById("tree");
	var svg = tmp.getElementsByTagName("svg")[0];
	// Extract the data as SVG text string
	var svg_xml = (new XMLSerializer).serializeToString(svg);

	// Submit the <FORM> to the server.
	// The result will be an attachment file to download.
	var form = document.getElementById("svgform");
	form['output_format'].value = output_format;
	form['data'].value = svg_xml ;
	form.submit();
}



	function show_svg_code(){
	// Get the d3js SVG element
	var tmp  = document.getElementById("tree");
	var svg = tmp.getElementsByTagName("svg")[0];

	// Extract the data as SVG text string
	var svg_xml = (new XMLSerializer).serializeToString(svg);

	//Optional: prettify the XML with proper indentations
	svg_xml = vkbeautify.xml(svg_xml);

	// Set the content of the <pre> element with the XML
	jQuery("#svg_code").text(svg_xml);

	//Optional: Use Google-Code-Prettifier to add colors.
	prettyPrint();
}
    
    